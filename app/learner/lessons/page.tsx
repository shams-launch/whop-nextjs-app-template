import { redirect } from 'next/navigation'
import { getCurrentUser, isLearner, getUserCreator } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Container, Heading, Text, Button, Card, Flex, Badge, Progress } from '@frosted-ui/react'
import { BookOpen, Play, CheckCircle, Lock, Trophy, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function LearnerLessonsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth')
  }

  const isUserLearner = await isLearner()
  if (!isUserLearner) {
    redirect('/')
  }

  const creator = await getUserCreator()
  if (!creator) {
    return (
      <Container size="4" className="py-8">
        <Card className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Heading size="6" className="mb-2">No Creator Assigned</Heading>
          <Text size="3" color="gray" className="mb-4">
            You haven't been assigned to a creator yet. Please contact your instructor.
          </Text>
          <Link href="/">
            <Button size="3">Back to Dashboard</Button>
          </Link>
        </Card>
      </Container>
    )
  }

  // Get published lessons from the creator
  const lessons = await prisma.lesson.findMany({
    where: { 
      creatorId: creator.id,
      isPublished: true 
    },
    orderBy: { order: 'asc' },
    include: {
      progress: {
        where: { userId: user.id }
      },
      quizzes: {
        where: { isPublished: true },
        include: {
          attempts: {
            where: { userId: user.id },
            orderBy: { completedAt: 'desc' },
            take: 1
          }
        }
      }
    }
  })

  // Get user's progress
  const userProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    include: { lesson: true }
  })

  const completedLessons = userProgress.filter(p => p.completed).length
  const totalLessons = lessons.length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <Container size="4" className="py-8">
      <div className="mb-8">
        <Heading size="8" className="mb-2">
          Your Learning Path
        </Heading>
        <Text size="5" color="gray">
          Master new skills with {creator.name}'s lessons
        </Text>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 mb-8">
        <Heading size="5" className="mb-4">Course Progress</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <Text size="6" weight="bold" color="blue">{completedLessons}</Text>
            <Text size="2" color="gray">Lessons Completed</Text>
          </div>
          <div className="text-center">
            <Text size="6" weight="bold" color="green">{totalLessons - completedLessons}</Text>
            <Text size="2" color="gray">Lessons Remaining</Text>
          </div>
          <div className="text-center">
            <Text size="6" weight="bold" color="purple">{Math.round(progressPercentage)}%</Text>
            <Text size="2" color="gray">Course Complete</Text>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="w-full" />
        <Text size="2" color="gray" className="mt-2">
          {completedLessons} of {totalLessons} lessons completed
        </Text>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => {
          const progress = lesson.progress[0]
          const isCompleted = progress?.completed || false
          const isLocked = index > 0 && !lessons[index - 1].progress[0]?.completed
          const hasQuiz = lesson.quizzes.length > 0
          const quizAttempt = lesson.quizzes[0]?.attempts[0]
          const quizCompleted = quizAttempt?.completed || false

          return (
            <Card key={lesson.id} className={`p-6 ${isLocked ? 'opacity-60' : ''}`}>
              <div className="mb-4">
                <Flex justify="between" align="center" className="mb-2">
                  <Badge color={isCompleted ? "green" : isLocked ? "gray" : "blue"}>
                    {isCompleted ? "Completed" : isLocked ? "Locked" : "Available"}
                  </Badge>
                  <Text size="2" color="gray">Lesson {lesson.order}</Text>
                </Flex>
                
                <Heading size="4" className="mb-2">{lesson.title}</Heading>
                {lesson.description && (
                  <Text size="2" color="gray" className="mb-4">
                    {lesson.description}
                  </Text>
                )}
              </div>

              <div className="space-y-3">
                {hasQuiz && (
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <Text size="2" color="gray">
                      {quizCompleted ? "Quiz completed" : "Quiz available"}
                    </Text>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Text size="2" color="green">Completed</Text>
                  </div>
                )}

                {isLocked && (
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <Text size="2" color="gray">Complete previous lesson first</Text>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {isLocked ? (
                  <Button size="3" variant="soft" disabled className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </Button>
                ) : (
                  <Link href={`/learner/lessons/${lesson.id}`}>
                    <Button size="3" className="w-full">
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review Lesson
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Lesson
                        </>
                      )}
                    </Button>
                  </Link>
                )}
              </div>

              {hasQuiz && !isLocked && (
                <div className="mt-3">
                  <Link href={`/learner/quizzes/${lesson.quizzes[0].id}`}>
                    <Button size="2" variant="soft" className="w-full">
                      <Trophy className="w-4 h-4 mr-2" />
                      {quizCompleted ? "Retake Quiz" : "Take Quiz"}
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {lessons.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Heading size="6" className="mb-2">No Lessons Available</Heading>
          <Text size="3" color="gray" className="mb-4">
            {creator.name} hasn't published any lessons yet.
          </Text>
          <Link href="/">
            <Button size="3">Back to Dashboard</Button>
          </Link>
        </Card>
      )}
    </Container>
  )
}

