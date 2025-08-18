#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { whopCompanyId: 'demo_company' },
    update: {},
    create: {
      whopCompanyId: 'demo_company',
      name: 'Demo Company',
      branding: {
        name: 'Demo Company',
        logo: null,
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981'
        }
      }
    }
  })

  console.log('✅ Created tenant:', tenant.name)

  // Create demo creator
  const creator = await prisma.user.upsert({
    where: { whopUserId: 'demo_creator' },
    update: {},
    create: {
      whopUserId: 'demo_creator',
      email: 'creator@demo.com',
      name: 'Demo Creator',
      role: 'CREATOR',
      tenantId: tenant.id
    }
  })

  console.log('✅ Created creator:', creator.name)

  // Create demo learners
  const learners = await Promise.all([
    prisma.user.upsert({
      where: { whopUserId: 'demo_learner_1' },
      update: {},
      create: {
        whopUserId: 'demo_learner_1',
        email: 'learner1@demo.com',
        name: 'John Smith',
        role: 'LEARNER',
        tenantId: tenant.id
      }
    }),
    prisma.user.upsert({
      where: { whopUserId: 'demo_learner_2' },
      update: {},
      create: {
        whopUserId: 'demo_learner_2',
        email: 'learner2@demo.com',
        name: 'Sarah Johnson',
        role: 'LEARNER',
        tenantId: tenant.id
      }
    })
  ])

  console.log('✅ Created learners:', learners.map(l => l.name))

  // Create specific test accounts for development/testing
  const testAccounts = await Promise.all([
    prisma.user.upsert({
      where: { whopUserId: '@testcreator' },
      update: {},
      create: {
        whopUserId: '@testcreator',
        email: 'testcreator@demo.com',
        name: 'Test Creator',
        role: 'CREATOR',
        tenantId: tenant.id
      }
    }),
    prisma.user.upsert({
      where: { whopUserId: '@testlearner' },
      update: {},
      create: {
        whopUserId: '@testlearner',
        email: 'testlearner@demo.com',
        name: 'Test Learner',
        role: 'LEARNER',
        tenantId: tenant.id
      }
    })
  ])

  console.log('✅ Created test accounts:', testAccounts.map(a => `${a.name} (${a.whopUserId})`))

  // Create demo course
  const course = await prisma.course.upsert({
    where: { id: 'demo_course' },
    update: {},
    create: {
      id: 'demo_course',
      title: 'Business Fundamentals',
      description: 'Learn the core concepts of modern business',
      tenantId: tenant.id
    }
  })

  console.log('✅ Created course:', course.title)

  // Create demo lessons
  const lessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: 'demo_lesson_1' },
      update: {},
      create: {
        id: 'demo_lesson_1',
        title: 'Introduction to Business',
        description: 'Learn the fundamentals of modern business operations',
        content: `
          <h2>Welcome to Business Fundamentals</h2>
          <p>This course will teach you the essential concepts of modern business operations.</p>
          <h3>What you'll learn:</h3>
          <ul>
            <li>Business models and strategies</li>
            <li>Market analysis and research</li>
            <li>Financial management basics</li>
            <li>Marketing and sales fundamentals</li>
          </ul>
        `,
        order: 1,
        isPublished: true,
        creatorId: creator.id
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'demo_lesson_2' },
      update: {},
      create: {
        id: 'demo_lesson_2',
        title: 'Business Models',
        description: 'Understanding different business models and strategies',
        content: `
          <h2>Understanding Business Models</h2>
          <p>A business model describes how a company creates, delivers, and captures value.</p>
          <h3>Key Components:</h3>
          <ul>
            <li>Value Proposition</li>
            <li>Customer Segments</li>
            <li>Revenue Streams</li>
            <li>Key Resources</li>
          </ul>
        `,
        order: 2,
        isPublished: true,
        creatorId: creator.id
      }
    })
  ])

  console.log('✅ Created lessons:', lessons.map(l => l.title))

  // Create demo quiz for first lesson
  const quiz = await prisma.quiz.upsert({
    where: { id: 'demo_quiz_1' },
    update: {},
    create: {
      id: 'demo_quiz_1',
      title: 'Business Fundamentals Quiz',
      isPublished: true,
      lessonId: lessons[0].id
    }
  })

  console.log('✅ Created quiz:', quiz.title)

  // Create demo questions
  const questions = await Promise.all([
    prisma.question.upsert({
      where: { id: 'demo_question_1' },
      update: {},
      create: {
        id: 'demo_question_1',
        type: 'MCQ',
        text: 'What is the primary goal of a business?',
        options: ['To make money', 'To serve customers', 'To create value', 'To compete'],
        correct: 'To create value',
        explanation: 'While businesses need to make money, their primary goal is to create value for customers.',
        orderIndex: 0,
        quizId: quiz.id
      }
    }),
    prisma.question.upsert({
      where: { id: 'demo_question_2' },
      update: {},
      create: {
        id: 'demo_question_2',
        type: 'TF',
        text: 'A business model describes how a company creates and delivers value.',
        correct: 'True',
        explanation: 'A business model is a framework for creating, delivering, and capturing value.',
        orderIndex: 1,
        quizId: quiz.id
      }
    }),
    prisma.question.upsert({
      where: { id: 'demo_question_3' },
      update: {},
      create: {
        id: 'demo_question_3',
        type: 'SHORT',
        text: 'What are the three main types of business organizations?',
        correct: 'Sole proprietorship, partnership, corporation',
        explanation: 'These are the three primary legal forms of business organization.',
        orderIndex: 2,
        quizId: quiz.id
      }
    })
  ])

  console.log('✅ Created questions:', questions.map(q => q.text.substring(0, 30) + '...'))

  // Create demo progress for learners
  const progress = await Promise.all([
    prisma.progress.upsert({
      where: { id: 'demo_progress_1' },
      update: {},
      create: {
        id: 'demo_progress_1',
        userId: learners[0].id,
        courseId: course.id,
        moduleId: modules[0].id,
        status: 'COMPLETED',
        lastScore: 85,
        timeSpent: 1800 // 30 minutes
      }
    }),
    prisma.progress.upsert({
      where: { id: 'demo_progress_2' },
      update: {},
      create: {
        id: 'demo_progress_2',
        userId: learners[1].id,
        courseId: course.id,
        moduleId: modules[0].id,
        status: 'IN_PROGRESS',
        timeSpent: 900 // 15 minutes
      }
    })
  ])

  console.log('✅ Created progress records')

  // Create demo quiz attempts
  const quizAttempt = await prisma.quizAttempt.upsert({
    where: { id: 'demo_attempt_1' },
    update: {},
    create: {
      id: 'demo_attempt_1',
      quizId: quiz.id,
      userId: learners[0].id,
      answers: {
        'demo_question_1': 'To create value',
        'demo_question_2': 'True',
        'demo_question_3': 'Sole proprietorship, partnership, corporation'
      },
      score: 85,
      passed: true,
      timeSpent: 300 // 5 minutes
    }
  })

  console.log('✅ Created quiz attempt with score:', quizAttempt.score)

  // Create demo streaks
  const streaks = await Promise.all([
    prisma.streak.upsert({
      where: { id: 'demo_streak_1' },
      update: {},
      create: {
        id: 'demo_streak_1',
        userId: learners[0].id,
        count: 7,
        lastDate: new Date(),
        tenantId: tenant.id
      }
    }),
    prisma.streak.upsert({
      where: { id: 'demo_streak_2' },
      update: {},
      create: {
        id: 'demo_streak_2',
        userId: learners[1].id,
        count: 3,
        lastDate: new Date(),
        tenantId: tenant.id
      }
    })
  ])

  console.log('✅ Created streaks:', streaks.map(s => `${s.count} days`))

  // Create demo achievements
  const achievements = await Promise.all([
    prisma.achievementDefinition.upsert({
      where: { id: 'demo_achievement_1' },
      update: {},
      create: {
        id: 'demo_achievement_1',
        code: 'FIRST_MODULE',
        name: 'First Module',
        description: 'Complete your first learning module',
        criteria: { type: 'module_completion', count: 1 },
        icon: '🎯',
        tenantId: tenant.id
      }
    }),
    prisma.achievementDefinition.upsert({
      where: { id: 'demo_achievement_2' },
      update: {},
      create: {
        id: 'demo_achievement_2',
        code: 'PERFECT_QUIZ',
        name: 'Perfect Score',
        description: 'Score 100% on any quiz',
        criteria: { type: 'quiz_score', score: 100 },
        icon: '🏆',
        tenantId: tenant.id
      }
    })
  ])

  console.log('✅ Created achievements:', achievements.map(a => a.name))

  // Grant achievements to learners
  await Promise.all([
    prisma.achievementGrant.upsert({
      where: { id: 'demo_grant_1' },
      update: {},
      create: {
        id: 'demo_grant_1',
        userId: learners[0].id,
        definitionId: achievements[0].id
      }
    }),
    prisma.achievementGrant.upsert({
      where: { id: 'demo_grant_2' },
      update: {},
      create: {
        id: 'demo_grant_2',
        userId: learners[0].id,
        definitionId: achievements[1].id
      }
    })
  ])

  console.log('✅ Granted achievements to learners')

  // Create demo leaderboard entries
  const leaderboardEntries = await Promise.all([
    prisma.leaderboardEntry.upsert({
      where: { id: 'demo_leaderboard_1' },
      update: {},
      create: {
        id: 'demo_leaderboard_1',
        courseId: course.id,
        userId: learners[0].id,
        score: 85,
        rank: 1
      }
    }),
    prisma.leaderboardEntry.upsert({
      where: { id: 'demo_leaderboard_2' },
      update: {},
      create: {
        id: 'demo_leaderboard_2',
        courseId: course.id,
        userId: learners[1].id,
        score: 70,
        rank: 2
      }
    })
  ])

  console.log('✅ Created leaderboard entries')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   • 1 Tenant: ${tenant.name}`)
  console.log(`   • 1 Creator: ${creator.name}`)
  console.log(`   • ${learners.length} Learners`)
  console.log(`   • 2 Test Accounts: @testcreator (CREATOR), @testlearner (LEARNER)`)
  console.log(`   • 1 Course: ${course.title}`)
  console.log(`   • ${modules.length} Modules`)
  console.log(`   • 1 Quiz with ${questions.length} Questions`)
  console.log(`   • ${achievements.length} Achievement Definitions`)
  console.log(`   • Progress tracking and leaderboards`)
  console.log('\n🧪 Test Accounts:')
  console.log(`   • @testcreator - Role: CREATOR - Email: testcreator@demo.com`)
  console.log(`   • @testlearner - Role: LEARNER - Email: testlearner@demo.com`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
