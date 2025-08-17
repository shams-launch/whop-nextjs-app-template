import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isLearner } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isUserLearner = await isLearner()
    if (!isUserLearner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { 
        id: params.quizId,
        isPublished: true
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        lesson: {
          include: {
            creator: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check if user has access to this quiz (through their creator)
    if (quiz.lesson?.creatorId !== user.creatorId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

