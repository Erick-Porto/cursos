-- =====================================================================
-- Conquistas globais (valem para qualquer curso).
-- Conquistas específicas de um curso vêm do course.json via content:sync.
-- Ícones: nomes do lucide em kebab-case (ver src/lib/icons.ts).
-- =====================================================================
insert into public.achievements (slug, title, description, icon, rarity, xp, rule, position) values
  ('primeiro-passo', 'Primeiro passo', 'Concluiu a primeira aula.',                       'footprints',     'common',    25,  '{"type":"lessons_completed","count":1}',  10),
  ('em-ritmo',       'Em ritmo',       'Concluiu 5 aulas.',                               'gauge',          'common',    50,  '{"type":"lessons_completed","count":5}',  20),
  ('maratonista',    'Maratonista',    'Concluiu 25 aulas.',                              'medal',          'rare',      150, '{"type":"lessons_completed","count":25}', 30),
  ('aprovado',       'Aprovado',       'Foi aprovado na primeira avaliação.',             'circle-check',   'common',    50,  '{"type":"assessments_passed","count":1}', 40),
  ('nota-maxima',    'Nota máxima',    'Gabaritou uma avaliação.',                        'star',           'rare',      100, '{"type":"perfect_score","count":1}',      50),
  ('de-primeira',    'De primeira',    'Aprovado na primeira tentativa em 3 avaliações.', 'target',         'epic',      150, '{"type":"first_try_pass","count":3}',     60),
  ('formado',        'Formado',        'Concluiu um curso inteiro.',                      'graduation-cap', 'epic',      200, '{"type":"course_completed","count":1}',   70),
  ('colecionador',   'Colecionador',   'Concluiu 3 cursos.',                              'crown',          'legendary', 500, '{"type":"course_completed","count":3}',   80),
  ('constancia',     'Constância',     'Estudou 7 dias seguidos.',                        'calendar-check', 'rare',      100, '{"type":"streak_days","days":7}',         90),
  ('inabalavel',     'Inabalável',     'Estudou 30 dias seguidos.',                       'shield',         'legendary', 400, '{"type":"streak_days","days":30}',        100),
  ('veterano',       'Veterano',       'Alcançou 1.000 XP.',                              'trophy',         'epic',      100, '{"type":"xp_reached","amount":1000}',     110),
  ('lenda',          'Lenda',          'Alcançou 5.000 XP.',                              'gem',            'legendary', 250, '{"type":"xp_reached","amount":5000}',     120)
on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  icon        = excluded.icon,
  rarity      = excluded.rarity,
  xp          = excluded.xp,
  rule        = excluded.rule,
  position    = excluded.position;
