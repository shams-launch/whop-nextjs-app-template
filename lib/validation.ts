import { z } from 'zod'

// ============================================================================
// CORE VALIDATION SCHEMAS
// ============================================================================

export const tenantSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  branding: z.object({
    name: z.string().optional(),
    logo: z.string().url().optional(),
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional()
    }).optional()
  }).optional()
})

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['CREATOR', 'LEARNER'])
})

// ============================================================================
// COURSE & CONTENT VALIDATION
// ============================================================================

export const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().optional(),
  modules: z.array(z.string()).optional() // module IDs
})

export const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  contentType: z.enum(['VIDEO', 'PDF', 'TEXT']),
  contentUrl: z.string().url().optional(),
  contentBody: z.string().optional(),
  orderIndex: z.number().int().min(0),
  quiz: z.string().optional(), // quiz ID
  node: z.object({
    onPassId: z.string().optional(),
    onFailId: z.string().optional(),
    meta: z.any().optional()
  }).optional(),
  funnel: z.object({
    type: z.enum(['CALENDLY', 'LINK', 'UPGRADE']),
    config: z.any()
  }).optional()
})

// ============================================================================
// QUIZ & ASSESSMENT VALIDATION
// ============================================================================

export const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  passingScore: z.number().int().min(0).max(100),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  questions: z.array(z.string()).optional() // question IDs
})

export const questionSchema = z.object({
  type: z.enum(['MCQ', 'TF', 'SHORT', 'MATCH', 'FILL']),
  text: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).optional(), // for MCQ/MATCH
  correct: z.union([z.string(), z.array(z.string()), z.any()]).optional(),
  explanation: z.string().optional(),
  orderIndex: z.number().int().min(0)
})

export const quizAttemptSchema = z.object({
  answers: z.any(), // submitted answers
  timeSpent: z.number().int().min(0).optional()
})

// ============================================================================
// UPLOAD & AI VALIDATION
// ============================================================================

export const uploadSchema = z.object({
  type: z.enum(['PDF', 'VIDEO', 'DOC', 'TRANSCRIPT']),
  url: z.string().url('Invalid file URL'),
  textExtract: z.string().optional()
})

export const aiQuizGenerationSchema = z.object({
  uploadId: z.string(),
  targetCount: z.number().int().min(5).max(20),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  questionTypes: z.array(z.enum(['MCQ', 'TF', 'SHORT', 'MATCH', 'FILL'])).optional()
})

// ============================================================================
// PROGRESS & TRACKING VALIDATION
// ============================================================================

export const progressSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'LOCKED']),
  lastScore: z.number().int().min(0).max(100).optional(),
  timeSpent: z.number().int().min(0).optional()
})

export const streakSchema = z.object({
  count: z.number().int().min(0),
  lastDate: z.date()
})

// ============================================================================
// GAMIFICATION VALIDATION
// ============================================================================

export const achievementSchema = z.object({
  code: z.string().min(1, 'Achievement code is required'),
  name: z.string().min(1, 'Achievement name is required'),
  description: z.string().optional(),
  criteria: z.any(),
  icon: z.string().optional()
})

export const leaderboardEntrySchema = z.object({
  score: z.number().int().min(0),
  rank: z.number().int().min(1).optional()
})

// ============================================================================
// API REQUEST VALIDATION
// ============================================================================

export const createCourseRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
})

export const createModuleRequestSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  contentType: z.enum(['VIDEO', 'PDF', 'TEXT']),
  contentUrl: z.string().url().optional(),
  contentBody: z.string().optional(),
  orderIndex: z.number().int().min(0)
})

export const createQuizRequestSchema = z.object({
  moduleId: z.string(),
  title: z.string().min(1),
  passingScore: z.number().int().min(0).max(100),
  questions: z.array(questionSchema)
})

export const submitQuizRequestSchema = z.object({
  quizId: z.string(),
  answers: z.any(),
  timeSpent: z.number().int().min(0).optional()
})

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function validateTenantId(tenantId: string): boolean {
  return z.string().cuid().safeParse(tenantId).success
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

export function validateFileUpload(file: File, maxSize: number = 10 * 1024 * 1024): boolean {
  const allowedTypes = [
    'application/pdf',
    'video/mp4',
    'video/webm',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  
  return file.size <= maxSize && allowedTypes.includes(file.type)
}

