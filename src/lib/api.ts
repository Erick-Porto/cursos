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
  Question,
  StudentProgressRow,
  SubmitResult,
  TrackResult,
} from '@/types/db'

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw res.error
  return res.data as T
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
}

export async function fetchCourseStructure(courseId: string): Promise<CourseStructure> {
  const [modules, lessons, assessments, achievements] = await Promise.all([
    supabase.from('modules').select('*').eq('course_id', courseId).order('position'),
    supabase.from('v_course_syllabus').select('*').eq('course_id', courseId).order('position'),
    supabase.from('assessments').select('*').eq('course_id', courseId).order('position'),
    supabase.from('achievements').select('*').eq('course_id', courseId).order('position'),
  ])
  return {
    modules: unwrap(modules) ?? [],
    lessons: unwrap(lessons) ?? [],
    assessments: unwrap(assessments) ?? [],
    achievements: unwrap(achievements) ?? [],
  }
}

export interface CourseProgress {
  progress: LessonProgress[]
  attempts: Attempt[]
}

export async function fetchCourseProgress(courseId: string): Promise<CourseProgress> {
  const uid = await myId()
  const [progress, attempts] = await Promise.all([
    supabase.from('lesson_progress').select('*').eq('user_id', uid).eq('course_id', courseId),
    supabase
      .from('attempts')
      .select('*')
      .eq('user_id', uid)
      .eq('course_id', courseId)
      .order('submitted_at', { ascending: false }),
  ])
  return { progress: unwrap(progress) ?? [], attempts: unwrap(attempts) ?? [] }
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
