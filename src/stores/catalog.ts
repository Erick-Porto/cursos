import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Course, Enrollment } from '@/types/db'

export const useCatalogStore = defineStore('catalog', () => {
  const courses = ref<Course[]>([])
  const enrollments = ref<Enrollment[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  const enrollmentByCourse = computed(() => new Map(enrollments.value.map((e) => [e.course_id, e])))
  const enrolledCourses = computed(() =>
    courses.value
      .filter((c) => enrollmentByCourse.value.has(c.id))
      .sort((a, b) => {
        const ea = enrollmentByCourse.value.get(a.id)!
        const eb = enrollmentByCourse.value.get(b.id)!
        return eb.last_activity_at.localeCompare(ea.last_activity_at)
      }),
  )

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      const [c, e] = await Promise.all([
        supabase.from('courses').select('*').order('created_at'),
        supabase.from('enrollments').select('*'),
      ])
      if (c.error) throw c.error
      courses.value = (c.data as Course[]) ?? []
      enrollments.value = (e.data as Enrollment[]) ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  function courseBySlug(slug: string): Course | undefined {
    return courses.value.find((c) => c.slug === slug)
  }

  function enrollmentFor(courseId: string): Enrollment | undefined {
    return enrollmentByCourse.value.get(courseId)
  }

  function applyEnrollment(e: Enrollment | null | undefined) {
    if (!e) return
    const idx = enrollments.value.findIndex((x) => x.id === e.id)
    if (idx === -1) enrollments.value.push(e)
    else enrollments.value[idx] = e
  }

  async function enroll(courseId: string): Promise<Enrollment> {
    const { data, error } = await supabase.rpc('enroll', { p_course_id: courseId })
    if (error) throw error
    const e = data as Enrollment
    applyEnrollment(e)
    return e
  }

  function reset() {
    courses.value = []
    enrollments.value = []
    loaded.value = false
  }

  return {
    courses,
    enrollments,
    loaded,
    loading,
    enrolledCourses,
    enrollmentByCourse,
    load,
    courseBySlug,
    enrollmentFor,
    applyEnrollment,
    enroll,
    reset,
  }
})
