import { redirect } from 'next/navigation'
import { getCurrentUser, isCreator } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Container, Heading, Text, Button, Card, Flex, Badge, Table, Dialog, TextField, TextArea, Select } from '@frosted-ui/react'
import { BookOpen, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default async function CreatorLessonsPage() {
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
    orderBy: { order: 'asc' },
    include: {
      progress: {
        include: {
          user: true
        }
      },
      quizzes: true
    }
  })

  return (
    <Container size="4" className="py-8">
      <div className="mb-8">
        <Flex justify="between" align="center">
          <div>
            <Heading size="8" className="mb-2">
              Manage Lessons
            </Heading>
            <Text size="5" color="gray">
              Create and organize your learning content
            </Text>
          </div>
          <Link href="/creator/lessons/new">
            <Button size="3">
              <Plus className="w-4 h-4 mr-2" />
              Create Lesson
            </Button>
          </Link>
        </Flex>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Text size="2" color="gray">Total Lessons</Text>
              <Text size="4" weight="bold">{lessons.length}</Text>
            </div>
          </Flex>
        </Card>
        
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Text size="2" color="gray">Published</Text>
              <Text size="4" weight="bold">{lessons.filter(l => l.isPublished).length}</Text>
            </div>
          </Flex>
        </Card>
        
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <EyeOff className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <Text size="2" color="gray">Drafts</Text>
              <Text size="4" weight="bold">{lessons.filter(l => !l.isPublished).length}</Text>
            </div>
          </Flex>
        </Card>
        
        <Card className="p-4">
          <Flex gap="3" align="center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Text size="2" color="gray">With Quizzes</Text>
              <Text size="4" weight="bold">{lessons.filter(l => l.quizzes.length > 0).length}</Text>
            </div>
          </Flex>
        </Card>
      </div>

      {/* Lessons Table */}
      <Card className="p-6">
        <Heading size="5" className="mb-6">All Lessons</Heading>
        
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Text size="4" color="gray" className="mb-2">No lessons yet</Text>
            <Text size="3" color="gray" className="mb-4">Create your first lesson to get started</Text>
            <Link href="/creator/lessons/new">
              <Button size="3">
                <Plus className="w-4 h-4 mr-2" />
                Create First Lesson
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Order</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quizzes</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {lessons.map((lesson) => (
                  <Table.Row key={lesson.id}>
                    <Table.Cell>
                      <div>
                        <Text size="3" weight="medium">{lesson.title}</Text>
                        {lesson.description && (
                          <Text size="2" color="gray" className="mt-1">
                            {lesson.description.substring(0, 50)}...
                          </Text>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={lesson.isPublished ? "green" : "yellow"}>
                        {lesson.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{lesson.order}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{lesson.quizzes.length} quiz{lesson.quizzes.length !== 1 ? 'es' : ''}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {lesson.progress.filter(p => p.completed).length} completed
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {new Date(lesson.createdAt).toLocaleDateString()}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="2">
                        <Link href={`/creator/lessons/${lesson.id}`}>
                          <Button size="1" variant="soft">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link href={`/creator/lessons/${lesson.id}/preview`}>
                          <Button size="1" variant="soft">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Button size="1" variant="soft" color="red">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </Card>
    </Container>
  )
}

