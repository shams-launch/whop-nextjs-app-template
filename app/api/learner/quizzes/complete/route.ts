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
        completed: true,
        completedAt: new Date()
      }
    })

    // Update lesson progress if this is the first completion
    if (quiz.lessonId) {
      const existingProgress = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: quiz.lessonId
          }
        }
      })

      if (!existingProgress) {
        await prisma.progress.create({
          data: {
            userId: user.id,
            lessonId: quiz.lessonId,
            completed: true,
            completedAt: new Date(),
            score
          }
        })
      }
    }

    // Update streak
    await updateUserStreak(user.id)

    // Award badges based on performance
    await awardBadges(user.id, score, totalQuestions)

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

  const streak = await prisma.streak.findUnique({
    where: { userId }
  })

  if (!streak) {
    // Create new streak
    await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today
      }
    })
  } else {
    const lastActivity = streak.lastActivityDate
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity)
      lastActivityDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutive day
        const newCurrentStreak = streak.currentStreak + 1
        await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: newCurrentStreak,
            longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
            lastActivityDate: today
          }
        })
      } else if (daysDiff > 1) {
        // Streak broken
        await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: 1,
            lastActivityDate: today
          }
        })
      }
      // If daysDiff === 0, already completed today, no update needed
    }
  }
}

async function awardBadges(userId: string, score: number, totalQuestions: number) {
  const percentage = (score / totalQuestions) * 100

  // Perfect score badge
  if (percentage === 100) {
    await awardBadgeIfNotExists(userId, 'PERFECT_QUIZ', 'Perfect Score!', 'Achieved 100% on a quiz', '🏆')
  }

  // Check for streak badges
  const streak = await prisma.streak.findUnique({
    where: { userId }
  })

  if (streak) {
    if (streak.currentStreak >= 7 && streak.currentStreak < 30) {
      await awardBadgeIfNotExists(userId, 'STREAK_7_DAYS', 'Week Warrior', 'Maintained a 7-day learning streak', '🔥')
    }
    
    if (streak.currentStreak >= 30) {
      await awardBadgeIfNotExists(userId, 'STREAK_30_DAYS', 'Monthly Master', 'Maintained a 30-day learning streak', '⭐')
    }
  }
}

async function awardBadgeIfNotExists(userId: string, type: string, name: string, description: string, icon: string) {
  const existingBadge = await prisma.badge.findFirst({
    where: {
      userId,
      type: type as any
    }
  })

  if (!existingBadge) {
    await prisma.badge.create({
      data: {
        userId,
        type: type as any,
        name,
        description,
        icon
      }
    })
  }
}

