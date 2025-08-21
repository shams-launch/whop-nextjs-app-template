import { redirect } from 'next/navigation'
import { getCurrentUser, isCreator } from '@/lib/auth'
import { Heading, Text, Button, Card, TextArea, Switch } from 'frosted-ui'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function NewLessonPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth')
  }

  const isUserCreator = await isCreator()
  if (!isUserCreator) {
    redirect('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/creator/lessons">
          <Button size="2" variant="soft" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Link>
        
        <Heading size="8" className="mb-2">
          Create New Lesson
        </Heading>
        <Text size="5" color="gray">
          Build engaging learning content for your students
        </Text>
      </div>

      <Card className="p-6">
        <form action="/api/creator/lessons" method="POST">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <Heading size="5" className="mb-4">Lesson Information</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Enter lesson title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="order" className="block text-sm font-medium mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    placeholder="1"
                    defaultValue="1"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <TextArea 
                  name="description" 
                  placeholder="Brief description of the lesson content"
                  rows={3}
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <Heading size="5" className="mb-4">Lesson Content</Heading>
              <div className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Content *
                  </label>
                  <TextArea 
                    name="content" 
                    required
                    placeholder="Enter your lesson content here. You can use markdown formatting."
                    rows={12}
                  />
                  <Text size="2" color="gray" className="mt-2">
                    Supports markdown formatting. You can include links, images, and formatted text.
                  </Text>
                </div>
                
                <div>
                  <label htmlFor="contentLink" className="block text-sm font-medium mb-2">
                    External Content Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="contentLink"
                    placeholder="https://example.com/lesson-content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Text size="2" color="gray" className="mt-2">
                    If your content is hosted elsewhere (YouTube, Google Docs, etc.)
                  </Text>
                </div>
              </div>
            </div>

            {/* AI Quiz Generation */}
            <div>
              <Heading size="5" className="mb-4">AI-Powered Quiz Generation</Heading>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex gap-3 items-center mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <Text size="3" weight="medium">Generate Quiz Questions</Text>
                </div>
                <Text size="2" color="gray" className="mb-4">
                  Let AI automatically create quiz questions based on your lesson content. 
                  This will help reinforce learning and test comprehension.
                </Text>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="generateQuiz" className="flex items-center gap-2">
                      <Switch name="generateQuiz" />
                      <span className="text-sm font-medium">Generate quiz questions</span>
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="numQuestions" className="block text-sm font-medium mb-2">
                      Number of Questions
                    </label>
                    <select
                      name="numQuestions"
                      defaultValue="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="3">3 questions</option>
                      <option value="5">5 questions</option>
                      <option value="10">10 questions</option>
                      <option value="15">15 questions</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Publishing */}
            <div>
              <Heading size="5" className="mb-4">Publishing</Heading>
              <div className="flex items-center gap-3">
                <Switch name="isPublished" />
                <div>
                  <Text size="3" weight="medium">Publish immediately</Text>
                  <Text size="2" color="gray">
                    Make this lesson available to learners right away
                  </Text>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <Link href="/creator/lessons">
                <Button size="3" variant="soft">
                  Cancel
                </Button>
              </Link>
              <Button size="3" type="submit">
                <Save className="w-4 h-4 mr-2" />
                Create Lesson
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

