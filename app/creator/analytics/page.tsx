import { redirect } from 'next/navigation'
import { getCurrentUser, isCreator } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Container, Heading, Text, Button, Card, Flex, Badge, Table, Progress } from '@frosted-ui/react'
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

  // Get all learners assigned to this creator
  const learners = await prisma.user.findMany({
    where: { 
      creatorId: user.id,
      role: 'LEARNER'
    },
    include: {
      progress: {
        include: {
          lesson: true
        }
      },
      badges: true,
      streaks: true,
      quizAttempts: {
        include: {
          quiz: {
            include: {
              lesson: true
            }
          }
        }
      }
    }
  })

  // Get creator's lessons and quizzes
  const lessons = await prisma.lesson.findMany({
    where: { creatorId: user.id },
    include: {
      progress: {
        include: {
          user: true
        }
      },
      quizzes: {
        include: {
          attempts: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })

  // Calculate analytics
  const totalLearners = learners.length
  const totalLessons = lessons.length
  const totalQuizzes = lessons.reduce((acc, lesson) => acc + lesson.quizzes.length, 0)
  
  const activeLearners = learners.filter(learner => {
    const lastActivity = learner.streaks?.lastActivityDate
    if (!lastActivity) return false
    const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceActivity <= 7
  }).length

  const avgCompletionRate = totalLessons > 0 
    ? Math.round((learners.reduce((acc, learner) => {
        const completedLessons = learner.progress.filter(p => p.completed).length
        return acc + (completedLessons / totalLessons)
      }, 0) / totalLearners) * 100)
    : 0

  return (
    <Container size="4" className="py-8">
      <div className="mb-8">
        <Heading size="8" className="mb-2">
          Analytics Dashboard
        </Heading>
        <Text size="5" color="gray">
          Track learner progress and engagement
        </Text>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Text size="2" color="gray">Total Learners</Text>
              <Text size="4" weight="bold">{totalLearners}</Text>
            </div>
          </Flex>
        </Card>
        
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Text size="2" color="gray">Active Learners</Text>
              <Text size="4" weight="bold">{activeLearners}</Text>
            </div>
          </Flex>
        </Card>
        
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Text size="2" color="gray">Avg. Completion</Text>
              <Text size="4" weight="bold">{avgCompletionRate}%</Text>
            </div>
          </Flex>
        </Card>
        
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <Text size="2" color="gray">Total Quizzes</Text>
              <Text size="4" weight="bold">{totalQuizzes}</Text>
            </div>
          </Flex>
        </Card>
      </div>

      {/* Learner Progress Table */}
      <Card className="p-6 mb-8">
        <Heading size="5" className="mb-6">Learner Progress</Heading>
        
        {learners.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Text size="4" color="gray" className="mb-2">No learners yet</Text>
            <Text size="3" color="gray">Learners will appear here once they join your course</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Learner</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Streak</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Badges</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Last Activity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {learners.map((learner) => {
                  const completedLessons = learner.progress.filter(p => p.completed).length
                  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
                  const currentStreak = learner.streaks?.currentStreak || 0
                  const badgeCount = learner.badges.length
                  const lastActivity = learner.streaks?.lastActivityDate
                  const daysSinceActivity = lastActivity 
                    ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
                    : null

                  return (
                    <Table.Row key={learner.id}>
                      <Table.Cell>
                        <div>
                          <Text size="3" weight="medium">{learner.name}</Text>
                          <Text size="2" color="gray">{learner.email}</Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="w-32">
                          <Progress value={progressPercentage} className="w-full mb-1" />
                          <Text size="2" color="gray">
                            {completedLessons}/{totalLessons} lessons
                          </Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="2" align="center">
                          <Badge color={currentStreak >= 7 ? "green" : "blue"}>
                            {currentStreak} days
                          </Badge>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{badgeCount} earned</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">
                          {daysSinceActivity !== null 
                            ? daysSinceActivity === 0 
                              ? 'Today' 
                              : `${daysSinceActivity} days ago`
                            : 'Never'
                          }
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <Link href={`/creator/learners/${learner.id}`}>
                            <Button size="1" variant="soft">
                              <Target className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button size="1" variant="soft">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </Card>

      {/* Lesson Performance */}
      <Card className="p-6">
        <Heading size="5" className="mb-6">Lesson Performance</Heading>
        
        {lessons.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Text size="4" color="gray" className="mb-2">No lessons yet</Text>
            <Text size="3" color="gray">Create lessons to see performance data</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => {
              const completedCount = lesson.progress.filter(p => p.completed).length
              const completionRate = totalLearners > 0 ? (completedCount / totalLearners) * 100 : 0
              const avgScore = lesson.progress.length > 0 
                ? Math.round(lesson.progress.reduce((acc, p) => acc + (p.score || 0), 0) / lesson.progress.length)
                : 0

              return (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Text size="3" weight="medium">{lesson.title}</Text>
                    <Text size="2" color="gray">
                      {completedCount} of {totalLearners} learners completed
                    </Text>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Text size="3" weight="bold" color="blue">{Math.round(completionRate)}%</Text>
                      <Text size="2" color="gray">Completion</Text>
                    </div>
                    
                    {avgScore > 0 && (
                      <div className="text-center">
                        <Text size="3" weight="bold" color="green">{avgScore}%</Text>
                        <Text size="2" color="gray">Avg Score</Text>
                      </div>
                    )}
                    
                    <Link href={`/creator/lessons/${lesson.id}`}>
                      <Button size="2" variant="soft">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </Container>
  )
}

