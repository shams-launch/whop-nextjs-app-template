import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isLearner, getUserCreator } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params
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
        id: quizId,
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

    // Check if user has access to this quiz (through their assigned creator)
    const userCreator = await getUserCreator()
    if (!userCreator || quiz.lesson?.creatorId !== userCreator.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

