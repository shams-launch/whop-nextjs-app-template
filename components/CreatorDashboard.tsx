'use client'

import { useState } from 'react'
import { Card, Heading, Text, Button, Badge, Table, TextField, TextArea } from 'frosted-ui'
import { Plus, BookOpen, Users, TrendingUp, Upload, Brain, Settings, FileText, Play } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Course {
  id: string
  title: string
  description?: string
  moduleCount: number
  learnerCount: number
  completionRate: number
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  title: string
  contentType: 'VIDEO' | 'PDF' | 'TEXT'
  hasQuiz: boolean
  hasFunnel: boolean
  orderIndex: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface Learner {
  id: string
  name: string
  email: string
  progress: number
  lastActivity: Date
  streak: number
  achievements: string[]
}

export interface Analytics {
  totalLearners: number
  activeLearners: number
  totalCourses: number
  totalModules: number
  averageCompletionRate: number
  totalQuizAttempts: number
  averageQuizScore: number
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'learners' | 'analytics' | 'uploads'>('overview')
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  // Mock data - in production this would come from API
  const mockAnalytics: Analytics = {
    totalLearners: 156,
    activeLearners: 89,
    totalCourses: 8,
    totalModules: 47,
    averageCompletionRate: 73,
    totalQuizAttempts: 1247,
    averageQuizScore: 78
  }

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Business Fundamentals',
      description: 'Core business concepts and principles',
      moduleCount: 12,
      learnerCount: 89,
      completionRate: 82,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-10')
    },
    {
      id: '2',
      title: 'Marketing Strategy',
      description: 'Modern marketing techniques and strategies',
      moduleCount: 8,
      learnerCount: 67,
      completionRate: 71,
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-08-08')
    }
  ]

  const mockLearners: Learner[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      progress: 85,
      lastActivity: new Date('2024-08-10'),
      streak: 7,
      achievements: ['First Module', 'Perfect Score', '7-Day Streak']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      progress: 92,
      lastActivity: new Date('2024-08-09'),
      streak: 12,
      achievements: ['Course Complete', 'Perfect Score', '30-Day Streak']
    }
  ]

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <Text size="2" color="gray">Total Learners</Text>
              <Heading size="4">{mockAnalytics.totalLearners}</Heading>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <Text size="2" color="gray">Active Courses</Text>
              <Heading size="4">{mockAnalytics.totalCourses}</Heading>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <Text size="2" color="gray">Completion Rate</Text>
              <Heading size="4">{mockAnalytics.averageCompletionRate}%</Heading>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Brain className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <Text size="2" color="gray">Avg Quiz Score</Text>
              <Heading size="4">{mockAnalytics.averageQuizScore}%</Heading>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <Heading size="5" className="mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => setShowCreateCourse(true)} className="h-20">
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <Text>Create Course</Text>
            </div>
          </Button>
          
          <Button onClick={() => setShowCreateModule(true)} variant="soft" className="h-20">
            <div className="text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <Text>Add Module</Text>
            </div>
          </Button>
          
          <Button onClick={() => setShowUpload(true)} variant="soft" className="h-20">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <Text>Upload Content</Text>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <Heading size="5" className="mb-4">Recent Activity</Heading>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Text weight="medium">New learner joined Business Fundamentals</Text>
              <Text size="2" color="gray">2 hours ago</Text>
            </div>
            <Badge variant="soft" color="green">New</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Text weight="medium">Quiz completed in Marketing Strategy</Text>
              <Text size="2" color="gray">4 hours ago</Text>
            </div>
            <Badge variant="soft" color="blue">Quiz</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Text weight="medium">Course "Business Fundamentals" updated</Text>
              <Text size="2" color="gray">1 day ago</Text>
            </div>
            <Badge variant="soft" color="orange">Updated</Badge>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading size="5">Courses</Heading>
        <Button onClick={() => setShowCreateCourse(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map(course => (
          <Card key={course.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Heading size="4">{course.title}</Heading>
              <Badge variant="soft" color="green">Active</Badge>
            </div>
            
            <Text color="gray" className="mb-4">{course.description}</Text>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <Text size="2" color="gray">Modules:</Text>
                <Text size="2">{course.moduleCount}</Text>
              </div>
              <div className="flex justify-between">
                <Text size="2" color="gray">Learners:</Text>
                <Text size="2">{course.learnerCount}</Text>
              </div>
              <div className="flex justify-between">
                <Text size="2" color="gray">Completion:</Text>
                <Text size="2">{course.completionRate}%</Text>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="soft" size="2" className="flex-1">
                Edit
              </Button>
              <Button variant="soft" size="2" className="flex-1">
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderLearners = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading size="5">Learners</Heading>
        <Button variant="soft">
          <Users className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Activity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Streak</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mockLearners.map(learner => (
              <Table.Row key={learner.id}>
                <Table.Cell>
                  <div>
                    <Text weight="medium">{learner.name}</Text>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {learner.achievements.slice(0, 2).map(achievement => (
                        <Badge key={achievement} size="1" variant="soft" color="blue">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{learner.email}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${learner.progress}%` }}
                      />
                    </div>
                    <Text size="2">{learner.progress}%</Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">
                    {learner.lastActivity.toLocaleDateString()}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant="soft" color="orange">
                    {learner.streak} days
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button variant="soft" size="2">
                    View Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Heading size="5">Analytics Dashboard</Heading>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Heading size="4" className="mb-4">Course Performance</Heading>
          <div className="space-y-4">
            {mockCourses.map(course => (
              <div key={course.id} className="flex justify-between items-center">
                <Text>{course.title}</Text>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                  <Text size="2">{course.completionRate}%</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Heading size="4" className="mb-4">Engagement Metrics</Heading>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Text>Total Quiz Attempts</Text>
              <Text weight="medium">{mockAnalytics.totalQuizAttempts}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Average Quiz Score</Text>
              <Text weight="medium">{mockAnalytics.averageQuizScore}%</Text>
            </div>
            <div className="flex justify-between">
              <Text>Active Learners</Text>
              <Text weight="medium">{mockAnalytics.activeLearners}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Total Modules</Text>
              <Text weight="medium">{mockAnalytics.totalModules}</Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <Card className="p-6">
        <Heading size="4" className="mb-4">Learning Trends</Heading>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <Text color="gray">Chart visualization would go here</Text>
        </div>
      </Card>
    </div>
  )

  const renderUploads = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading size="5">Content Uploads</Heading>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <Card className="p-6">
        <div className="text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Heading size="4" className="mb-2">Upload Content</Heading>
          <Text color="gray" className="mb-6">
            Upload PDFs, videos, or documents to automatically generate quizzes and content
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Text size="2" weight="medium">PDF Documents</Text>
              <Text size="1" color="gray">Upload business documents</Text>
            </div>
            
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Text size="2" weight="medium">Video Content</Text>
              <Text size="1" color="gray">Upload training videos</Text>
            </div>
            
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Text size="2" weight="medium">AI Generation</Text>
              <Text size="1" color="gray">Auto-generate quizzes</Text>
            </div>
          </div>
          
          <Button size="3">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </Card>
    </div>
  )

  // ============================================================================
  // MODAL COMPONENTS
  // ============================================================================

  const renderCreateCourseModal = () => (
    showCreateCourse && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-md">
          <Heading size="4" className="mb-4">Create New Course</Heading>
          
          <div className="space-y-4">
            <div>
              <Text size="2" weight="medium" className="mb-2">Course Title</Text>
              <TextField placeholder="Enter course title" />
            </div>
            
            <div>
              <Text size="2" weight="medium" className="mb-2">Description</Text>
              <TextArea placeholder="Enter course description" />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button variant="soft" onClick={() => setShowCreateCourse(false)}>
              Cancel
            </Button>
            <Button>
              Create Course
            </Button>
          </div>
        </Card>
      </div>
    )
  )

  const renderCreateModuleModal = () => (
    showCreateModule && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-md">
          <Heading size="4" className="mb-4">Create New Module</Heading>
          
          <div className="space-y-4">
            <div>
              <Text size="2" weight="medium" className="mb-2">Module Title</Text>
              <TextField placeholder="Enter module title" />
            </div>
            
            <div>
              <Text size="2" weight="medium" className="mb-2">Content Type</Text>
              <select className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="TEXT">Text</option>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
            
            <div>
              <Text size="2" weight="medium" className="mb-2">Content</Text>
              <TextArea placeholder="Enter module content or URL" />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button variant="soft" onClick={() => setShowCreateModule(false)}>
              Cancel
            </Button>
            <Button>
              Create Module
            </Button>
          </div>
        </Card>
      </div>
    )
  )

  const renderUploadModal = () => (
    showUpload && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-md">
          <Heading size="4" className="mb-4">Upload Content</Heading>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Text className="mb-2">Drop files here or click to browse</Text>
              <Text size="2" color="gray">Supports PDF, DOC, MP4, and more</Text>
            </div>
            
            <div>
              <Text size="2" weight="medium" className="mb-2">Generate AI Quiz?</Text>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <Text size="2">Automatically generate quiz questions from content</Text>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button variant="soft" onClick={() => setShowUpload(false)}>
              Cancel
            </Button>
            <Button>
              Upload & Process
            </Button>
          </div>
        </Card>
      </div>
    )
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <Heading size="5">Creator Dashboard</Heading>
          <div className="flex items-center space-x-3">
            <Button variant="soft" size="2">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'learners', label: 'Learners', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'uploads', label: 'Uploads', icon: Upload }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'learners' && renderLearners()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'uploads' && renderUploads()}
      </div>

      {/* Modals */}
      {renderCreateCourseModal()}
      {renderCreateModuleModal()}
      {renderUploadModal()}
    </div>
  )
}

