import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isLearner } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isUserLearner = await isLearner()
    if (!isUserLearner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { quizId, score, totalQuestions } = await request.json()

    // Get quiz and lesson info
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: true
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: user.id,
        score,
        totalQuestions,
        completedAt: new Date()
      }
    })

    // Update lesson progress if this is the first completion
    if (quiz.lessonId) {
      const existingProgress = await prisma.progress.findFirst({
        where: {
          userId: user.id,
          lessonId: quiz.lessonId
        }
      })

      if (!existingProgress) {
        await prisma.progress.create({
          data: {
            userId: user.id,
            lessonId: quiz.lessonId,
            completed: true,
            score
          }
        })
      }
    }

    // Update streak
    await updateUserStreak(user.id)

    return NextResponse.json({ 
      success: true, 
      attemptId: attempt.id,
      score 
    })
  } catch (error) {
    console.error('Error completing quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function updateUserStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const streak = await prisma.streak.findFirst({
    where: { userId }
  })

  if (!streak) {
    // Create new streak
    await prisma.streak.create({
      data: {
        userId,
        count: 1,
        lastDate: today,
        tenantId: 'default' // TODO: Get from user's tenant
      }
    })
  } else {
    const lastActivity = streak.lastDate
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity)
      lastActivityDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutive day
        await prisma.streak.update({
          where: { id: streak.id },
          data: {
            count: streak.count + 1,
            lastDate: today
          }
        })
      } else if (daysDiff > 1) {
        // Streak broken
        await prisma.streak.update({
          where: { id: streak.id },
          data: {
            count: 1,
            lastDate: today
          }
        })
      }
      // If daysDiff === 0, already completed today, no update needed
    }
  }
}



