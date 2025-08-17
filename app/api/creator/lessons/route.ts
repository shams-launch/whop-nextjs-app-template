import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isCreator } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateQuizQuestions } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isUserCreator = await isCreator()
    if (!isUserCreator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const contentLink = formData.get('contentLink') as string
    const order = parseInt(formData.get('order') as string) || 1
    const isPublished = formData.get('isPublished') === 'on'
    const generateQuiz = formData.get('generateQuiz') === 'on'
    const numQuestions = parseInt(formData.get('numQuestions') as string) || 5

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        creatorId: user.id,
        title,
        description,
        content,
        contentLink,
        order,
        isPublished
      }
    })

    // Generate quiz questions if requested
    if (generateQuiz && content) {
      try {
        const questions = await generateQuizQuestions(content, numQuestions)
        
        // Create quiz
        const quiz = await prisma.quiz.create({
          data: {
            creatorId: user.id,
            lessonId: lesson.id,
            title: `${title} Quiz`,
            description: `Quiz for ${title}`,
            isPublished: isPublished
          }
        })

        // Create questions
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i]
          await prisma.question.create({
            data: {
              quizId: quiz.id,
              questionText: question.question,
              choices: question.choices,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              order: i
            }
          })
        }
      } catch (error) {
        console.error('Error generating quiz questions:', error)
        // Continue without quiz generation if it fails
      }
    }

    return NextResponse.redirect(new URL('/creator/lessons', request.url))
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isUserCreator = await isCreator()
    if (!isUserCreator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const lessons = await prisma.lesson.findMany({
      where: { creatorId: user.id },
      orderBy: { order: 'asc' },
      include: {
        quizzes: {
          include: {
            questions: true
          }
        },
        progress: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

