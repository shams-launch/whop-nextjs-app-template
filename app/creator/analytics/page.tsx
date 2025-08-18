import { redirect } from 'next/navigation'
import { getCurrentUser, isCreator } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Heading, Text, Button, Card, Badge, Progress } from 'frosted-ui'
import { TrendingUp, Users, BookOpen, Trophy, MessageCircle, Target } from 'lucide-react'
import Link from 'next/link'

export default async function CreatorAnalyticsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth')
  }

  const isUserCreator = await isCreator()
  if (!isUserCreator) {
    redirect('/')
  }

  // Get creator's lessons
  const lessons = await prisma.lesson.findMany({
    where: { creatorId: user.id },
    include: {
      quizzes: true
    }
  })

  // Get all learners
  const learners = await prisma.user.findMany({
    where: { 
      role: 'LEARNER'
    }
  })

  // Get quiz attempts
  const quizAttempts = await prisma.quizAttempt.findMany({
    include: {
      quiz: true,
      user: true
    }
  })

  // Calculate basic analytics
  const totalLearners = learners.length
  const totalLessons = lessons.length
  const totalQuizzes = lessons.reduce((acc, lesson) => acc + lesson.quizzes.length, 0)
  const totalAttempts = quizAttempts.length

  // Calculate average quiz score
  const averageQuizScore = totalAttempts > 0 
    ? Math.round(quizAttempts.reduce((acc, attempt) => acc + attempt.score, 0) / totalAttempts)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Heading size="8" className="mb-2">
          Analytics Dashboard
        </Heading>
        <Text size="5" color="gray">
          Track your course performance and learner engagement
        </Text>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex gap-3 items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <Text size="2" color="gray">Total Learners</Text>
              <Text size="5" weight="bold">{totalLearners}</Text>
            </div>
          </div>
          <Progress value={totalLearners > 0 ? 100 : 0} className="w-full" />
          <Text size="1" color="gray" className="mt-2">All registered learners</Text>
        </Card>

        <Card className="p-6">
          <div className="flex gap-3 items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <Text size="2" color="gray">Lessons Created</Text>
              <Text size="5" weight="bold">{totalLessons}</Text>
            </div>
          </div>
          <Progress value={totalLessons > 0 ? 100 : 0} className="w-full" />
          <Text size="1" color="gray" className="mt-2">Your published lessons</Text>
        </Card>

        <Card className="p-6">
          <div className="flex gap-3 items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <Text size="2" color="gray">Total Quizzes</Text>
              <Text size="5" weight="bold">{totalQuizzes}</Text>
            </div>
          </div>
          <Progress value={totalQuizzes > 0 ? 100 : 0} className="w-full" />
          <Text size="1" color="gray" className="mt-2">Quizzes created</Text>
        </Card>

        <Card className="p-6">
          <div className="flex gap-3 items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <Text size="2" color="gray">Avg. Quiz Score</Text>
              <Text size="5" weight="bold">{averageQuizScore}%</Text>
            </div>
          </div>
          <Progress value={averageQuizScore} className="w-full" />
          <Text size="1" color="gray" className="mt-2">Based on {totalAttempts} attempts</Text>
        </Card>
      </div>

      {/* Recent Quiz Attempts */}
      <Card className="p-6">
        <Heading size="6" className="mb-6">Recent Quiz Attempts</Heading>
        
        {quizAttempts.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Text size="4" color="gray" className="mb-2">No quiz attempts yet</Text>
            <Text size="3" color="gray">Learners will appear here once they take your quizzes</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {quizAttempts.slice(0, 10).map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Text size="3" weight="medium">{attempt.user.name || attempt.user.email}</Text>
                  <Text size="2" color="gray">
                    {attempt.quiz.title} - {attempt.score}/{attempt.totalQuestions} questions
                  </Text>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Text size="3" weight="bold" color="blue">
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                    </Text>
                    <Text size="2" color="gray">Score</Text>
                  </div>
                  
                  <Badge color="green" size="1">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Lesson Overview */}
      <Card className="p-6 mt-8">
        <Heading size="6" className="mb-6">Your Lessons</Heading>
        
        {lessons.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Text size="4" color="gray" className="mb-2">No lessons yet</Text>
            <Text size="3" color="gray">Create lessons to start building your course</Text>
            <Link href="/creator/lessons/new" className="mt-4 inline-block">
              <Button size="3">Create Your First Lesson</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Text size="3" weight="medium">{lesson.title}</Text>
                  <Text size="2" color="gray">
                    {lesson.quizzes.length} quizzes • {lesson.isPublished ? 'Published' : 'Draft'}
                  </Text>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Text size="3" weight="bold" color="blue">
                      {lesson.quizzes.length}
                    </Text>
                    <Text size="2" color="gray">Quizzes</Text>
                  </div>
                  
                  <Link href={`/creator/lessons/${lesson.id}`}>
                    <Button size="2" variant="soft">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

