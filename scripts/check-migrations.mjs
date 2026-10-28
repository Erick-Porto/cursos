// =====================================================================
// Valida as migrations em um Postgres em memória (PGlite) e roda um
// teste funcional: cria usuário, curso, aula e avaliação, matricula,
// registra progresso, envia uma prova e confere XP/conquistas/RLS.
//
//   npm run db:check
// =====================================================================
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(root, 'supabase', 'migrations')

let failures = 0
function ok(cond, msg) {
  if (cond) console.log(`  ok   ${msg}`)
  else {
    failures++
    console.log(`  FAIL ${msg}`)
  }
}

const db = new PGlite()

console.log('> stub do ambiente Supabase')
await db.exec(readFileSync(join(root, 'supabase', 'dev', 'stub_supabase.sql'), 'utf8'))

for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()) {
  console.log(`> migration ${file}`)
  try {
    await db.exec(readFileSync(join(migrationsDir, file), 'utf8'))
  } catch (err) {
    console.error(`  ERRO em ${file}: ${err.message}`)
    process.exit(1)
  }
}

console.log('> teste funcional')

// usuário via trigger de auth.users
const { rows: users } = await db.query(
  `insert into auth.users (email, raw_user_meta_data)
   values ('aluno@example.com', '{"full_name":"Aluno Teste"}') returning id`,
)
const userId = users[0].id
const { rows: profiles } = await db.query('select * from public.profiles where id = $1', [userId])
ok(profiles.length === 1 && profiles[0].full_name === 'Aluno Teste', 'trigger cria o perfil')
ok(profiles[0].username === 'aluno', 'username gerado do e-mail')

// conteúdo (como faria o content:sync com a service role)
const { rows: courses } = await db.query(
  `insert into public.courses (slug, title, is_published) values ('curso-teste', 'Curso Teste', true) returning id`,
)
const courseId = courses[0].id
const { rows: lessons } = await db.query(
  `insert into public.lessons (course_id, slug, title, position, slide_count, content_md)
   values ($1, 'aula-1', 'Aula 1', 1, 3, '# Oi'), ($1, 'aula-2', 'Aula 2', 2, 2, '# Oi 2') returning id`,
  [courseId],
)
const { rows: assessments } = await db.query(
  `insert into public.assessments (course_id, lesson_id, slug, title, kind, passing_score, max_attempts)
   values ($1, $2, 'quiz-1', 'Quiz 1', 'quiz', 70, 2) returning id`,
  [courseId, lessons[0].id],
)
const assessmentId = assessments[0].id
const { rows: questions } = await db.query(
  `insert into public.questions (assessment_id, key, position, type, prompt_md, options, points) values
   ($1, 'q1', 1, 'single',    'Qual comando insere?', '[{"key":"a","text":"INSERT"},{"key":"b","text":"UPDATE"}]', 1),
   ($1, 'q2', 2, 'multiple',  'Quais são DML?',       '[{"key":"a","text":"INSERT"},{"key":"b","text":"CREATE"},{"key":"c","text":"DELETE"}]', 2),
   ($1, 'q3', 3, 'truefalse', 'DELETE sem WHERE apaga tudo.', null, 1),
   ($1, 'q4', 4, 'fill',      'A constraint ___ impede nulos.', null, 1)
   returning id, key`,
  [assessmentId],
)
const qid = Object.fromEntries(questions.map((q) => [q.key, q.id]))
await db.query(
  `insert into public.question_keys (question_id, answer) values
   ($1, '"a"'), ($2, '["a","c"]'), ($3, 'true'), ($4, '[["NOT NULL","not null"]]')`,
  [qid.q1, qid.q2, qid.q3, qid.q4],
)
await db.query(
  `insert into public.achievements (slug, title, description, icon, rarity, xp, rule, course_id)
   values ('mestre-teste', 'Mestre do teste', 'Concluiu o Curso Teste.', 'award', 'epic', 100,
           '{"type":"course_completed"}', $1)`,
  [courseId],
)

// roteiro do instrutor (como faria o content:sync)
await db.query(
  `insert into public.class_scripts (course_id, slug, title, position, lesson_slugs, content_md)
   values ($1, 'e01', 'Roteiro do encontro 1', 1, '{aula-1,aula-2}', '## Abertura')`,
  [courseId],
)

// a partir daqui, agimos como o usuário autenticado (RLS ativa)
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId])
await db.exec(`set role authenticated`)

// gabarito invisível
const { rows: keys } = await db.query('select * from public.question_keys')
ok(keys.length === 0, 'RLS: aluno não lê question_keys')
const { rows: scriptsAsStudent } = await db.query('select * from public.class_scripts')
ok(scriptsAsStudent.length === 0, 'RLS: aluno não lê class_scripts (roteiros do instrutor)')

// aulas invisíveis antes da matrícula
let { rows: vis } = await db.query('select id from public.lessons')
ok(vis.length === 0, 'RLS: aulas ocultas antes da matrícula')
const { rows: syl } = await db.query('select id from public.v_course_syllabus where course_id = $1', [courseId])
ok(syl.length === 2, 'sumário visível antes da matrícula')

// escrita direta bloqueada
let blocked = false
try {
  await db.query(`insert into public.lesson_progress (user_id, lesson_id, course_id) values ($1, $2, $3)`, [userId, lessons[0].id, courseId])
} catch {
  blocked = true
}
ok(blocked, 'RLS: aluno não grava lesson_progress diretamente')

// matrícula
const { rows: enr } = await db.query('select * from public.enroll($1)', [courseId])
ok(enr.length === 1 && enr[0].course_id === courseId, 'enroll() cria matrícula')
;({ rows: vis } = await db.query('select id from public.lessons'))
ok(vis.length === 2, 'RLS: aulas visíveis após matrícula')

// progresso
let { rows: t1 } = await db.query('select public.track_lesson_progress($1, 1, 3, 30, false) as r', [lessons[0].id])
let r = t1[0].r
ok(r.progress.status === 'in_progress' && r.progress.last_slide === 1, 'progresso parcial salvo')
ok(r.xp_gained === 0, 'sem XP antes de concluir')
;({ rows: t1 } = await db.query('select public.track_lesson_progress($1, 2, 3, 45, true) as r', [lessons[0].id]))
r = t1[0].r
ok(r.progress.status === 'completed', 'aula concluída')
ok(r.progress.time_spent_seconds === 75, 'tempo acumulado (30 + 45)')
ok(r.xp_gained === 50, 'XP de aula concluída')
ok(r.new_achievements.some((a) => a.slug === 'primeiro-passo'), 'conquista "primeiro-passo"')
ok(Number(r.enrollment.progress_pct) === 33.3, `progresso 1 de 3 itens (${r.enrollment.progress_pct}%)`)

// avaliação: reprovação
const bad = { [qid.q1]: 'b', [qid.q2]: ['a'], [qid.q3]: false, [qid.q4]: ['unique'] }
let { rows: s1 } = await db.query('select public.submit_attempt($1, $2::jsonb) as r', [assessmentId, JSON.stringify(bad)])
r = s1[0].r
ok(r.attempt.passed === false && Number(r.attempt.pct) === 0, 'reprovação corrigida no servidor')
ok(r.attempt.attempt_number === 1, 'tentativa 1')
ok(r.attempt.details[0].correct_answer === 'a', 'gabarito revelado só no resultado')

// avaliação: aprovação com variação de maiúsculas/espaços
const good = { [qid.q1]: 'A', [qid.q2]: ['c', 'a'], [qid.q3]: 'true', [qid.q4]: ['  not   NULL '] }
;({ rows: s1 } = await db.query('select public.submit_attempt($1, $2::jsonb) as r', [assessmentId, JSON.stringify(good)]))
r = s1[0].r
ok(r.attempt.passed === true && Number(r.attempt.pct) === 100, 'aprovação com nota 100')
ok(r.xp_gained === 150, 'XP de aprovação + bônus de nota máxima')
ok(r.new_achievements.some((a) => a.slug === 'aprovado'), 'conquista "aprovado"')
ok(r.new_achievements.some((a) => a.slug === 'nota-maxima'), 'conquista "nota-maxima"')
ok(Number(r.enrollment.progress_pct) === 66.7, `progresso 2 de 3 itens (${r.enrollment.progress_pct}%)`)

// limite de tentativas
blocked = false
try {
  await db.query('select public.submit_attempt($1, $2::jsonb) as r', [assessmentId, JSON.stringify(good)])
} catch (e) {
  blocked = /tentativas/.test(e.message)
}
ok(blocked, 'limite de tentativas respeitado')

// conclusão do curso
;({ rows: t1 } = await db.query('select public.track_lesson_progress($1, 1, 2, 10, true) as r', [lessons[1].id]))
r = t1[0].r
ok(Number(r.enrollment.progress_pct) === 100 && r.enrollment.completed_at, 'curso concluído')
ok(r.new_achievements.some((a) => a.slug === 'formado'), 'conquista global "formado"')
ok(r.new_achievements.some((a) => a.slug === 'mestre-teste'), 'conquista específica do curso')

const { rows: stats } = await db.query('select * from public.user_stats where user_id = $1', [userId])
const st = stats[0]
ok(st.lessons_completed === 2 && st.assessments_passed === 1 && st.courses_completed === 1, 'estatísticas consolidadas')
ok(st.current_streak === 1, 'sequência de dias iniciada')
// aula 50 + primeiro-passo 25 + quiz 150 + aprovado 50 + nota-maxima 100 + aula 50
// + curso 300 + formado 200 + mestre-teste 100 = 1025 => cruza 1000 e dispara veterano (+100)
const expectedXp = 1125
ok(r.new_achievements.some((a) => a.slug === 'veterano'), 'conquista em cascata (veterano via XP de outras conquistas)')
ok(st.xp === expectedXp, `XP total ${st.xp} (esperado ${expectedXp})`)

// painel do instrutor: aluno comum vê só a própria linha
const { rows: mine } = await db.query('select * from public.v_student_progress')
ok(mine.length === 1 && mine[0].lessons_completed === 2, 'v_student_progress com security_invoker')

await db.exec('reset role')

// roteiros do instrutor: visíveis para quem tem papel instructor
await db.query(`update public.user_roles set role = 'instructor' where user_id = $1`, [userId])
await db.exec(`set role authenticated`)
const { rows: scriptsAsStaff } = await db.query('select slug, lesson_slugs from public.class_scripts where course_id = $1', [courseId])
ok(scriptsAsStaff.length === 1 && scriptsAsStaff[0].lesson_slugs.length === 2, 'instrutor lê class_scripts com as aulas ligadas')
await db.exec('reset role')

// ---------------------------------------------------------------------
// projetos avaliados (migration 0004): entrega, devolução, reenvio e nota
// ---------------------------------------------------------------------
console.log('> projetos avaliados')
const asUser = async (id) => {
  await db.exec('reset role')
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [id])
  await db.exec('set role authenticated')
}
const fails = async (sql, params, pattern) => {
  try {
    await db.query(sql, params)
    return false
  } catch (e) {
    return pattern.test(e.message)
  }
}

const { rows: c2 } = await db.query(
  `insert into public.courses (slug, title, is_published) values ('curso-projetos', 'Curso Projetos', true) returning id`,
)
const course2 = c2[0].id
await db.query(
  `insert into public.lessons (course_id, slug, title, position, slide_count, content_md)
   values ($1, 'aula-p', 'Aula P', 1, 2, '# P')`,
  [course2],
)
const rubric = [
  { key: 'regras', title: 'Regras', points: 60 },
  { key: 'git', title: 'Git', points: 40 },
]
const { rows: pr } = await db.query(
  `insert into public.projects (course_id, slug, title, rubric, steps, passing_score)
   values ($1, 'projeto-1', 'Projeto 1', $2::jsonb, '[{"lesson":"aula-p","title":"Etapa 1"}]', 70) returning id`,
  [course2, JSON.stringify(rubric)],
)
const projectId = pr[0].id
await db.query(`insert into public.project_guides (project_id, content_md) values ($1, '## Como corrigir')`, [projectId])
await db.query(
  `insert into public.achievements (slug, title, description, icon, rarity, xp, rule, course_id)
   values ('projetista', 'Projetista', 'Aprovou um projeto.', 'award', 'rare', 40, '{"type":"projects_approved","count":1}', $1)`,
  [course2],
)
const { rows: u2 } = await db.query(
  `insert into auth.users (email, raw_user_meta_data) values ('aluna@example.com', '{"full_name":"Aluna Projetos"}') returning id`,
)
const student = u2[0].id

await asUser(student)
let { rows: guides } = await db.query('select * from public.project_guides')
ok(guides.length === 0, 'RLS: aluno não lê project_guides (guia de correção)')
const { rows: visibleProjects } = await db.query('select id from public.projects where course_id = $1', [course2])
ok(visibleProjects.length === 1, 'aluno lê o enunciado de curso publicado')
ok(
  await fails('select public.submit_project($1, $2)', [projectId, 'https://github.com/aluna/projeto-1'], /matrícula/),
  'entrega exige matrícula',
)
await db.query('select * from public.enroll($1)', [course2])
ok(await fails('select public.submit_project($1, $2)', [projectId, 'github.com/aluna'], /inválido/), 'link sem https é recusado')
ok(
  await fails(
    `insert into public.project_submissions (user_id, project_id, course_id, repo_url) values ($1, $2, $3, 'https://x.com/y')`,
    [student, projectId, course2],
    /./,
  ),
  'RLS: aluno não grava project_submissions diretamente',
)
let { rows: sp } = await db.query('select public.submit_project($1, $2, null, $3) as r', [
  projectId,
  'https://github.com/aluna/projeto-1',
  'Primeira versão',
])
let sub = sp[0].r.submission
ok(sub.status === 'submitted' && sub.version === 1, 'entrega registrada (versão 1, aguardando correção)')
;({ rows: sp } = await db.query('select public.submit_project($1, $2) as r', [projectId, 'https://github.com/aluna/racha-conta']))
sub = sp[0].r.submission
ok(sub.version === 1 && sub.repo_url.endsWith('racha-conta') && sub.notes === null, 'antes da correção, reenviar troca o link na mesma versão')
ok(
  await fails(`select public.grade_project($1, '{"regras":60,"git":40}'::jsonb, 'ok', true)`, [sub.id], /instrutores/),
  'aluno não corrige projeto',
)

// o primeiro usuário virou instructor acima
await asUser(userId)
const { rows: staffSees } = await db.query('select id from public.project_submissions where project_id = $1', [projectId])
ok(staffSees.length === 1, 'instrutor vê as entregas dos alunos')
;({ rows: guides } = await db.query('select * from public.project_guides'))
ok(guides.length === 1, 'instrutor lê o guia de correção')
ok(
  await fails(`select public.grade_project($1, '{"regras":61,"git":40}'::jsonb, null, true)`, [sub.id], /entre 0 e 60/),
  'nota acima do máximo do critério é recusada',
)
ok(await fails(`select public.grade_project($1, '{"regras":50}'::jsonb, null, true)`, [sub.id], /falta a nota/), 'critério sem nota é recusado')
let { rows: gr } = await db.query(
  `select public.grade_project($1, '{"regras":30,"git":20}'::jsonb, 'Faltou a divisão dos centavos.', false) as r`,
  [sub.id],
)
sub = gr[0].r.submission
ok(sub.status === 'returned' && Number(sub.pct) === 50 && sub.passed === null, 'devolvido para ajustes com nota parcial')

await asUser(student)
;({ rows: sp } = await db.query('select public.submit_project($1, $2) as r', [projectId, 'https://github.com/aluna/racha-conta']))
sub = sp[0].r.submission
ok(
  sub.version === 2 && sub.status === 'submitted' && sub.history.length === 1 && sub.history[0].feedback === 'Faltou a divisão dos centavos.',
  'reenvio vira versão 2 e guarda a anterior no histórico',
)

await asUser(userId)
;({ rows: gr } = await db.query(`select public.grade_project($1, '{"regras":55,"git":35}'::jsonb, 'Muito bom.', true) as r`, [sub.id]))
sub = gr[0].r.submission
ok(sub.status === 'graded' && sub.passed === true && Number(sub.pct) === 90, 'nota final aprovada (90)')
ok(gr[0].r.xp_gained === 200, 'XP da primeira aprovação do projeto')

await asUser(student)
ok(
  await fails('select public.submit_project($1, $2)', [projectId, 'https://github.com/aluna/outro'], /nota final/),
  'com nota final, o aluno só reenvia se o instrutor devolver',
)
const { rows: earned } = await db.query(
  `select a.slug from public.user_achievements ua join public.achievements a on a.id = ua.achievement_id where ua.user_id = $1`,
  [student],
)
ok(earned.some((a) => a.slug === 'projetista'), 'conquista com regra projects_approved')
const { rows: e2 } = await db.query('select progress_pct from public.enrollments where user_id = $1 and course_id = $2', [student, course2])
ok(Number(e2[0].progress_pct) === 50, `progresso conta o projeto aprovado (1 de 2 itens: ${e2[0].progress_pct}%)`)

await asUser(userId)
;({ rows: gr } = await db.query(`select public.grade_project($1, '{"regras":60,"git":35}'::jsonb, 'Revisto.', true) as r`, [sub.id]))
ok(gr[0].r.xp_gained === 0 && Number(gr[0].r.submission.pct) === 95, 'corrigir de novo atualiza a nota sem repetir o XP')
await db.exec('reset role')
await db.close()

console.log(failures === 0 ? '\nTudo certo.' : `\n${failures} falha(s).`)
process.exit(failures === 0 ? 0 : 1)
