// Consultas ao Supabase usadas pelas telas. Mantém as views finas e
// concentra o conhecimento sobre tabelas/RPCs num só lugar.
import { currentUserId, supabase } from '@/lib/supabase'
import type {
  Achievement,
  ActivityEntry,
  AnswerValue,
  Assessment,
  Attempt,
  ClassScript,
  Course,
  Lesson,
  LessonProgress,
  LessonSummary,
  Module,
  Project,
  ProjectGradeResult,
  ProjectSubmission,
  ProjectSubmitResult,
  Question,
  StudentProgressRow,
  SubmitResult,
  TrackResult,
} from '@/types/db'

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw res.error
  return res.data as T
}

type DbError = { code?: string; message: string } | null

/** Tabela que ainda não existe no banco (migration não aplicada): o PostgREST responde PGRST205. */
function isMissingTable(err: DbError): boolean {
  return !!err && (err.code === 'PGRST205' || err.code === '42P01' || /schema cache|does not exist/i.test(err.message))
}

/** Lista de uma tabela opcional: vazia enquanto a migration dela não for aplicada. */
function listOrEmpty<T>(res: { data: unknown; error: DbError }): T[] {
  if (isMissingTable(res.error)) return []
  return (unwrap(res) as T[] | null) ?? []
}

/** Uma linha de uma tabela opcional: null enquanto a migration dela não for aplicada. */
function oneOrNull<T>(res: { data: unknown; error: DbError }): T | null {
  if (isMissingTable(res.error)) return null
  return (unwrap(res) as T | null) ?? null
}

/**
 * Id de quem está logado, para filtrar as consultas aos próprios dados. Não dá para
 * confiar só na RLS: para instrutor e admin ela devolve as linhas de todos os alunos.
 */
async function myId(): Promise<string> {
  const id = await currentUserId()
  if (!id) throw new Error('Sua sessão expirou. Entre novamente.')
  return id
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  return unwrap(await supabase.from('courses').select('*').eq('slug', slug).maybeSingle())
}

export interface CourseStructure {
  modules: Module[]
  lessons: LessonSummary[]
  assessments: Assessment[]
  achievements: Achievement[]
  projects: Project[]
}

/** Projeto sem o enunciado: a página do curso só lista. */
const PROJECT_LIST_COLUMNS =
  'id, course_id, module_id, slug, title, summary, section, rubric, steps, opens_lesson, due_lesson, due_label, passing_score, is_required, position'

export async function fetchCourseStructure(courseId: string): Promise<CourseStructure> {
  const [modules, lessons, assessments, achievements, projects] = await Promise.all([
    supabase.from('modules').select('*').eq('course_id', courseId).order('position'),
    supabase.from('v_course_syllabus').select('*').eq('course_id', courseId).order('position'),
    supabase.from('assessments').select('*').eq('course_id', courseId).order('position'),
    supabase.from('achievements').select('*').eq('course_id', courseId).order('position'),
    supabase.from('projects').select(PROJECT_LIST_COLUMNS).eq('course_id', courseId).order('position'),
  ])
  return {
    modules: unwrap(modules) ?? [],
    lessons: unwrap(lessons) ?? [],
    assessments: unwrap(assessments) ?? [],
    achievements: unwrap(achievements) ?? [],
    projects: listOrEmpty<Project>(projects),
  }
}

export interface CourseProgress {
  progress: LessonProgress[]
  attempts: Attempt[]
  submissions: ProjectSubmission[]
}

export async function fetchCourseProgress(courseId: string): Promise<CourseProgress> {
  const uid = await myId()
  const [progress, attempts, submissions] = await Promise.all([
    supabase.from('lesson_progress').select('*').eq('user_id', uid).eq('course_id', courseId),
    supabase
      .from('attempts')
      .select('*')
      .eq('user_id', uid)
      .eq('course_id', courseId)
      .order('submitted_at', { ascending: false }),
    supabase.from('project_submissions').select('*').eq('user_id', uid).eq('course_id', courseId),
  ])
  return {
    progress: unwrap(progress) ?? [],
    attempts: unwrap(attempts) ?? [],
    submissions: listOrEmpty<ProjectSubmission>(submissions),
  }
}

export async function fetchLesson(courseId: string, slug: string): Promise<Lesson | null> {
  return unwrap(await supabase.from('lessons').select('*').eq('course_id', courseId).eq('slug', slug).maybeSingle())
}

export async function fetchLessonProgress(lessonId: string): Promise<LessonProgress | null> {
  const uid = await myId()
  return unwrap(
    await supabase.from('lesson_progress').select('*').eq('user_id', uid).eq('lesson_id', lessonId).maybeSingle(),
  )
}

export async function fetchAssessment(
  courseId: string,
  slug: string,
): Promise<{ assessment: Assessment; questions: Question[] } | null> {
  const assessment = unwrap<Assessment | null>(
    await supabase.from('assessments').select('*').eq('course_id', courseId).eq('slug', slug).maybeSingle(),
  )
  if (!assessment) return null
  const questions = unwrap<Question[]>(
    await supabase.from('questions').select('*').eq('assessment_id', assessment.id).order('position'),
  )
  return { assessment, questions: questions ?? [] }
}

export async function fetchAttempts(assessmentId: string): Promise<Attempt[]> {
  const uid = await myId()
  return (
    unwrap(
      await supabase
        .from('attempts')
        .select('*')
        .eq('user_id', uid)
        .eq('assessment_id', assessmentId)
        .order('submitted_at', { ascending: false }),
    ) ?? []
  )
}

export async function fetchAttempt(attemptId: string): Promise<Attempt | null> {
  return unwrap(await supabase.from('attempts').select('*').eq('id', attemptId).maybeSingle())
}

export async function trackLessonProgress(args: {
  lessonId: string
  slide: number
  slideCount: number
  seconds?: number
  complete?: boolean
}): Promise<TrackResult> {
  return unwrap(
    await supabase.rpc('track_lesson_progress', {
      p_lesson_id: args.lessonId,
      p_slide: args.slide,
      p_slide_count: args.slideCount,
      p_seconds: args.seconds ?? 0,
      p_complete: args.complete ?? false,
    }),
  ) as TrackResult
}

export async function submitAttempt(
  assessmentId: string,
  answers: Record<string, AnswerValue>,
  startedAt: string | null,
): Promise<SubmitResult> {
  return unwrap(
    await supabase.rpc('submit_attempt', {
      p_assessment_id: assessmentId,
      p_answers: answers,
      p_started_at: startedAt,
    }),
  ) as SubmitResult
}

export async function fetchRecentActivity(limit = 8): Promise<ActivityEntry[]> {
  const uid = await myId()
  return (
    unwrap(
      await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(limit),
    ) ?? []
  )
}

export async function fetchMyAttempts(limit = 20): Promise<Attempt[]> {
  const uid = await myId()
  return (
    unwrap(
      await supabase
        .from('attempts')
        .select('*')
        .eq('user_id', uid)
        .order('submitted_at', { ascending: false })
        .limit(limit),
    ) ?? []
  )
}

export async function fetchMyLessonProgress(): Promise<LessonProgress[]> {
  const uid = await myId()
  return (
    unwrap(
      await supabase.from('lesson_progress').select('*').eq('user_id', uid).order('updated_at', { ascending: false }),
    ) ?? []
  )
}

export async function fetchStudentProgress(): Promise<StudentProgressRow[]> {
  return (
    unwrap(
      await supabase.from('v_student_progress').select('*').order('last_activity_at', { ascending: false }),
    ) ?? []
  )
}

export async function fetchAllAttemptsForStaff(courseId: string): Promise<Attempt[]> {
  return unwrap(await supabase.from('attempts').select('*').eq('course_id', courseId)) ?? []
}

export async function fetchLessonsIndex(): Promise<LessonSummary[]> {
  return unwrap(await supabase.from('v_course_syllabus').select('*')) ?? []
}

// ---- Roteiros de aula (instrutor) ----

/** Cursos visíveis para quem consulta (staff enxerga também os não publicados, via RLS). */
export async function fetchCoursesForStaff(): Promise<Course[]> {
  return unwrap(await supabase.from('courses').select('*').order('title')) ?? []
}

/** Roteiros de um curso, em ordem. Para alunos a RLS devolve lista vazia. */
export async function fetchClassScripts(courseId: string): Promise<ClassScript[]> {
  return unwrap(await supabase.from('class_scripts').select('*').eq('course_id', courseId).order('position')) ?? []
}

export async function fetchClassScript(courseId: string, slug: string): Promise<ClassScript | null> {
  return unwrap(
    await supabase.from('class_scripts').select('*').eq('course_id', courseId).eq('slug', slug).maybeSingle(),
  )
}

// ---- Projetos avaliados ----

export async function fetchProject(courseId: string, slug: string): Promise<Project | null> {
  return oneOrNull<Project>(await supabase.from('projects').select('*').eq('course_id', courseId).eq('slug', slug).maybeSingle())
}

export async function fetchMySubmission(projectId: string): Promise<ProjectSubmission | null> {
  const uid = await myId()
  return oneOrNull<ProjectSubmission>(
    await supabase.from('project_submissions').select('*').eq('user_id', uid).eq('project_id', projectId).maybeSingle(),
  )
}

export async function submitProject(args: {
  projectId: string
  repoUrl: string
  demoUrl?: string | null
  notes?: string | null
}): Promise<ProjectSubmitResult> {
  return unwrap(
    await supabase.rpc('submit_project', {
      p_project_id: args.projectId,
      p_repo_url: args.repoUrl,
      p_demo_url: args.demoUrl || null,
      p_notes: args.notes || null,
    }),
  ) as ProjectSubmitResult
}

/** Projetos de um curso, com enunciado (staff vê também os de cursos não publicados). */
export async function fetchProjectsForStaff(courseId: string): Promise<Project[]> {
  return listOrEmpty<Project>(await supabase.from('projects').select('*').eq('course_id', courseId).order('position'))
}

/** Entregas de todos os alunos de um curso (a RLS só libera para staff). */
export async function fetchSubmissionsForStaff(courseId: string): Promise<ProjectSubmission[]> {
  return listOrEmpty<ProjectSubmission>(
    await supabase.from('project_submissions').select('*').eq('course_id', courseId).order('submitted_at', { ascending: false }),
  )
}

export async function fetchSubmissionForStaff(projectId: string, userId: string): Promise<ProjectSubmission | null> {
  return oneOrNull<ProjectSubmission>(
    await supabase.from('project_submissions').select('*').eq('project_id', projectId).eq('user_id', userId).maybeSingle(),
  )
}

/** Guia de correção do projeto (só staff lê). */
export async function fetchProjectGuide(projectId: string): Promise<string | null> {
  const row = oneOrNull<{ content_md: string }>(
    await supabase.from('project_guides').select('content_md').eq('project_id', projectId).maybeSingle(),
  )
  return row?.content_md ?? null
}

export async function gradeProject(args: {
  submissionId: string
  scores: Record<string, number>
  feedback: string
  final: boolean
}): Promise<ProjectGradeResult> {
  return unwrap(
    await supabase.rpc('grade_project', {
      p_submission_id: args.submissionId,
      p_scores: args.scores,
      p_feedback: args.feedback,
      p_final: args.final,
    }),
  ) as ProjectGradeResult
}
