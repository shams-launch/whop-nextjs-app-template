import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { generateWrongAnswerFeedback } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question, correctAnswer, userAnswer, explanation } = await request.json()

    if (!question || !correctAnswer || !userAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const feedback = await generateWrongAnswerFeedback(
      question,
      correctAnswer,
      userAnswer,
      explanation
    )

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error generating AI feedback:', error)
    return NextResponse.json({ 
      feedback: 'Great effort! Keep learning and you\'ll get it next time.' 
    })
  }
}

