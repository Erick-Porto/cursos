// Tipos das tabelas/views/RPCs do Supabase (espelham supabase/migrations/0001_schema.sql).

export type UserRole = 'student' | 'instructor' | 'admin'
export type LessonStatus = 'in_progress' | 'completed'
export type QuestionType = 'single' | 'multiple' | 'truefalse' | 'fill'
export type AssessmentKind = 'quiz' | 'exam'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Profile {
  id: string
  username: string | null
  full_name: string
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface UserStats {
  user_id: string
  xp: number
  lessons_completed: number
  assessments_passed: number
  courses_completed: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  updated_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description_md: string | null
  cover_url: string | null
  color: string | null
  icon: string | null
  level: string | null
  estimated_hours: number | null
  tags: string[]
  instructor_name: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  slug: string
  title: string
  description: string | null
  position: number
}

/** Linha de v_course_syllabus (sem conteúdo). */
export interface LessonSummary {
  id: string
  course_id: string
  module_id: string | null
  slug: string
  title: string
  summary: string | null
  objectives: string[]
  duration_minutes: number | null
  position: number
  slide_count: number
}

export interface Lesson extends LessonSummary {
  content_md: string
  is_published: boolean
}

/** Roteiro de aula do instrutor (um por encontro presencial). Só staff lê. */
export interface ClassScript {
  id: string
  course_id: string
  module_id: string | null
  slug: string
  title: string
  summary: string | null
  duration_minutes: number | null
  position: number
  lesson_slugs: string[]
  content_md: string
  created_at: string
  updated_at: string
}

/** Critério da rubrica de um projeto. */
export interface RubricCriterion {
  key: string
  title: string
  description: string | null
  points: number
}

/** Etapa de um projeto, ligada à aula do encontro em que acontece. */
export interface ProjectStep {
  lesson: string
  when: string | null
  title: string
  summary: string | null
}

/** Projeto avaliado (enunciado + rubrica). Espelha supabase/migrations/0004_projects.sql. */
export interface Project {
  id: string
  course_id: string
  module_id: string | null
  slug: string
  title: string
  summary: string | null
  section: string | null
  content_md: string
  rubric: RubricCriterion[]
  steps: ProjectStep[]
  opens_lesson: string | null
  due_lesson: string | null
  due_label: string | null
  passing_score: number
  is_required: boolean
  position: number
}

export type SubmissionStatus = 'submitted' | 'returned' | 'graded'

/** Versão anterior de uma entrega (guardada quando o aluno reenvia depois de uma devolução). */
export interface SubmissionVersion {
  version: number
  repo_url: string
  demo_url: string | null
  notes: string | null
  submitted_at: string
  status: SubmissionStatus
  scores: Record<string, number> | null
  score: number | null
  max_score: number | null
  pct: number | null
  feedback: string | null
  graded_at: string | null
}

export interface ProjectSubmission {
  id: string
  user_id: string
  project_id: string
  course_id: string
  version: number
  repo_url: string
  demo_url: string | null
  notes: string | null
  status: SubmissionStatus
  submitted_at: string
  scores: Record<string, number> | null
  score: number | null
  max_score: number | null
  pct: number | null
  passed: boolean | null
  feedback: string | null
  graded_by: string | null
  graded_at: string | null
  history: SubmissionVersion[]
  updated_at: string
}

export interface Assessment {
  id: string
  course_id: string
  lesson_id: string | null
  slug: string
  title: string
  description: string | null
  kind: AssessmentKind
  passing_score: number
  max_attempts: number | null
  time_limit_minutes: number | null
  shuffle_questions: boolean
  shuffle_options: boolean
  show_answers: boolean
  is_required: boolean
  position: number
}

export interface QuestionOption {
  key: string
  text: string
}

export interface Question {
  id: string
  assessment_id: string
  key: string
  position: number
  type: QuestionType
  prompt_md: string
  options: QuestionOption[] | null
  explanation_md: string | null
  points: number
}

/** Resposta do aluno a uma questão (formato enviado ao submit_attempt). */
export type AnswerValue = string | string[] | boolean | null

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
  progress_pct: number
  last_lesson_id: string | null
  last_activity_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  status: LessonStatus
  last_slide: number
  max_slide: number
  slide_count: number
  time_spent_seconds: number
  started_at: string
  completed_at: string | null
  updated_at: string
}

export interface AttemptDetail {
  question_id: string
  key: string
  position: number
  type: QuestionType
  points: number
  earned: number
  correct: boolean
  user_answer: AnswerValue
  correct_answer: unknown
  explanation_md: string | null
}

export interface Attempt {
  id: string
  user_id: string
  assessment_id: string
  course_id: string
  attempt_number: number
  answers: Record<string, AnswerValue>
  details: AttemptDetail[]
  score: number
  max_score: number
  pct: number
  passed: boolean
  started_at: string | null
  submitted_at: string
}

export interface Achievement {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  rarity: Rarity
  xp: number
  rule: Record<string, unknown>
  course_id: string | null
  is_secret: boolean
  position: number
}

export interface UserAchievement {
  user_id: string
  achievement_id: string
  earned_at: string
}

export interface ActivityEntry {
  id: number
  user_id: string
  kind: string
  ref_id: string | null
  xp: number
  meta: Record<string, unknown> | null
  created_at: string
}

/** Linha de v_student_progress (painel do instrutor). */
export interface StudentProgressRow {
  course_id: string
  course_slug: string
  course_title: string
  user_id: string
  full_name: string
  username: string | null
  avatar_url: string | null
  enrolled_at: string
  progress_pct: number
  completed_at: string | null
  last_activity_at: string
  lessons_completed: number
  lessons_total: number
  avg_best_pct: number
  time_spent_seconds: number
}

export interface TrackResult {
  progress: LessonProgress
  enrollment: Enrollment | null
  xp_gained: number
  new_achievements: Achievement[]
}

export interface ProjectSubmitResult {
  submission: ProjectSubmission
}

export interface ProjectGradeResult {
  submission: ProjectSubmission
  xp_gained: number
}

export interface SubmitResult {
  attempt: Attempt
  enrollment: Enrollment | null
  xp_gained: number
  new_achievements: Achievement[]
}
