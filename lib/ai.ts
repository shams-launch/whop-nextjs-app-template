import OpenAI from 'openai'
import { aiQuizGenerationSchema } from './validation'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ============================================================================
// AI QUIZ GENERATION
// ============================================================================

export interface AIQuizGenerationRequest {
  uploadId: string
  targetCount: number
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
  questionTypes?: ('MCQ' | 'TF' | 'SHORT' | 'MATCH' | 'FILL')[]
}

export interface AIQuestion {
  type: 'MCQ' | 'TF' | 'SHORT' | 'MATCH' | 'FILL'
  text: string
  options?: string[]
  correct: string | string[] | Record<string, string>
  explanation: string
  orderIndex: number
}

export interface AIQuizResponse {
  questions: AIQuestion[]
  metadata: {
    totalQuestions: number
    difficulty: string
    estimatedTime: number
    topics: string[]
  }
}

/**
 * Generate quiz questions from extracted text using OpenAI
 */
export async function generateQuizQuestions(
  text: string,
  request: AIQuizGenerationRequest
): Promise<AIQuizResponse> {
  try {
    // Validate request
    const validatedRequest = aiQuizGenerationSchema.parse(request)
    
    // Create the prompt for OpenAI
    const prompt = createQuizGenerationPrompt(text, validatedRequest)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert educational content creator specializing in business skills assessment. 
          Generate high-quality, engaging quiz questions that test understanding and application of concepts.
          
          IMPORTANT: Return ONLY valid JSON matching the exact schema provided. Do not include any other text.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
    
    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }
    
    // Parse and validate the response
    const parsedResponse = JSON.parse(response)
    return validateAIQuizResponse(parsedResponse)
    
  } catch (error) {
    console.error('AI Quiz Generation Error:', error)
    throw new Error('Failed to generate quiz questions')
  }
}

/**
 * Create the prompt for quiz generation
 */
function createQuizGenerationPrompt(text: string, request: AIQuizGenerationRequest): string {
  const { targetCount, difficulty, questionTypes } = request
  
  const questionTypesText = questionTypes?.join(', ') || 'MCQ, TF, SHORT, MATCH, FILL'
  const difficultyText = difficulty || 'MEDIUM'
  
  return `Generate ${targetCount} quiz questions from the following text. 
  
  Requirements:
  - Question types: ${questionTypesText}
  - Difficulty: ${difficultyText}
  - Mix of question types for variety
  - Questions should test understanding, not just memorization
  - Include explanations for correct answers
  
  Text to analyze:
  "${text.substring(0, 3000)}..."
  
  Return JSON in this exact format:
  {
    "questions": [
      {
        "type": "MCQ",
        "text": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": "Option A",
        "explanation": "Explanation of why this is correct",
        "orderIndex": 0
      }
    ],
    "metadata": {
      "totalQuestions": ${targetCount},
      "difficulty": "${difficultyText}",
      "estimatedTime": 15,
      "topics": ["topic1", "topic2"]
    }
  }`
}

/**
 * Validate the AI response format
 */
function validateAIQuizResponse(response: any): AIQuizResponse {
  if (!response.questions || !Array.isArray(response.questions)) {
    throw new Error('Invalid response format: missing questions array')
  }
  
  if (!response.metadata) {
    throw new Error('Invalid response format: missing metadata')
  }
  
  // Validate each question
  const validatedQuestions = response.questions.map((q: any, index: number) => {
    if (!q.type || !q.text || !q.correct) {
      throw new Error(`Invalid question at index ${index}: missing required fields`)
    }
    
    return {
      type: q.type,
      text: q.text,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation || '',
      orderIndex: q.orderIndex || index
    } as AIQuestion
  })
  
  return {
    questions: validatedQuestions,
    metadata: {
      totalQuestions: response.metadata.totalQuestions || validatedQuestions.length,
      difficulty: response.metadata.difficulty || 'MEDIUM',
      estimatedTime: response.metadata.estimatedTime || 15,
      topics: response.metadata.topics || []
    }
  }
}

// ============================================================================
// AI FEEDBACK GENERATION
// ============================================================================

export interface AIFeedbackRequest {
  question: string
  correctAnswer: string
  userAnswer: string
  context?: string
}

export interface AIFeedbackResponse {
  explanation: string
  suggestions: string[]
  relatedTopics: string[]
}

/**
 * Generate personalized feedback for incorrect answers
 */
export async function generateWrongAnswerFeedback(
  request: AIFeedbackRequest
): Promise<AIFeedbackResponse> {
  try {
    const prompt = createFeedbackPrompt(request)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful educational tutor. Provide clear, encouraging feedback for incorrect answers.
          Focus on explaining why the answer is wrong and how to think about the question correctly.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
    
    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }
    
    return parseFeedbackResponse(response)
    
  } catch (error) {
    console.error('AI Feedback Generation Error:', error)
    return {
      explanation: 'Sorry, I couldn\'t generate feedback right now. Please review the correct answer and try again.',
      suggestions: ['Review the question carefully', 'Check your understanding of the concept'],
      relatedTopics: []
    }
  }
}

/**
 * Create the prompt for feedback generation
 */
function createFeedbackPrompt(request: AIFeedbackRequest): string {
  const { question, correctAnswer, userAnswer, context } = request
  
  return `Question: ${question}
  
  Correct Answer: ${correctAnswer}
  User's Answer: ${userAnswer}
  
  ${context ? `Context: ${context}` : ''}
  
  Please provide:
  1. A clear explanation of why the user's answer is incorrect
  2. 2-3 specific suggestions for improvement
  3. Related topics they should review
  
  Format your response as:
  EXPLANATION: [your explanation]
  SUGGESTIONS: [suggestion 1], [suggestion 2], [suggestion 3]
  TOPICS: [topic 1], [topic 2], [topic 3]`
}

/**
 * Parse the feedback response
 */
function parseFeedbackResponse(response: string): AIFeedbackResponse {
  const explanationMatch = response.match(/EXPLANATION:\s*(.+?)(?=\n|SUGGESTIONS:|$)/i)
  const suggestionsMatch = response.match(/SUGGESTIONS:\s*(.+?)(?=\n|TOPICS:|$)/i)
  const topicsMatch = response.match(/TOPICS:\s*(.+?)(?=\n|$)/i)
  
  const explanation = explanationMatch?.[1]?.trim() || 
    'The answer is incorrect. Review the question and try again.'
  
  const suggestions = suggestionsMatch?.[1]?.split(',').map(s => s.trim()) || 
    ['Review the question carefully', 'Check your understanding of the concept']
  
  const relatedTopics = topicsMatch?.[1]?.split(',').map(t => t.trim()) || []
  
  return {
    explanation,
    suggestions,
    relatedTopics
  }
}

// ============================================================================
// RATE LIMITING & AUDIT
// ============================================================================

export interface AIAuditLog {
  timestamp: Date
  operation: 'quiz_generation' | 'feedback_generation'
  input: any
  output: any
  tokensUsed: number
  cost: number
}

/**
 * Log AI operations for audit purposes
 */
export function logAIOperation(
  operation: AIAuditLog['operation'],
  input: any,
  output: any,
  tokensUsed: number
): void {
  const auditLog: AIAuditLog = {
    timestamp: new Date(),
    operation,
    input,
    output,
    tokensUsed,
    cost: calculateCost(tokensUsed)
  }
  
  // In production, save this to database
  console.log('AI Audit Log:', auditLog)
}

/**
 * Calculate cost based on token usage (approximate)
 */
function calculateCost(tokens: number): number {
  // GPT-4 pricing (approximate)
  const costPer1kTokens = 0.03
  return (tokens / 1000) * costPer1kTokens
}

