'use client'

import { useState, useEffect } from 'react'
import { Card, Heading, Text, Button, Badge } from 'frosted-ui'
import { Play, FileText, BookOpen, CheckCircle, XCircle } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Module {
  id: string
  title: string
  contentType: 'VIDEO' | 'PDF' | 'TEXT'
  contentUrl?: string
  contentBody?: string
  orderIndex: number
  quiz?: Quiz
  funnel?: Funnel
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  passingScore: number
}

export interface Question {
  id: string
  type: 'MCQ' | 'TF' | 'SHORT' | 'MATCH' | 'FILL'
  text: string
  options?: string[]
  correct: string | string[] | Record<string, string>
  explanation?: string
  orderIndex: number
}

export interface Funnel {
  id: string
  type: 'CALENDLY' | 'LINK' | 'UPGRADE'
  config: Record<string, any>
}

export interface LessonPlayerProps {
  module: Module
  onComplete: (score?: number) => void
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LessonPlayer({
  module,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: LessonPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStarted && !showResults) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStarted, showResults])

  // Start the lesson
  const startLesson = () => {
    setIsStarted(true)
  }

  // Handle answer submission
  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  // Submit quiz
  const submitQuiz = () => {
    if (!module.quiz) return

    const totalQuestions = module.quiz.questions.length
    let correctAnswers = 0

    module.quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (isAnswerCorrect(question, userAnswer)) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)
    setScore(finalScore)
    setShowResults(true)
  }

  // Check if answer is correct
  const isAnswerCorrect = (question: Question, userAnswer: any): boolean => {
    if (!userAnswer) return false

    switch (question.type) {
      case 'MCQ':
      case 'TF':
      case 'SHORT':
        return userAnswer === question.correct
      case 'MATCH':
        return JSON.stringify(userAnswer) === JSON.stringify(question.correct)
      case 'FILL':
        return Array.isArray(question.correct) 
          ? question.correct.includes(userAnswer)
          : userAnswer === question.correct
      default:
        return false
    }
  }

  // Complete lesson
  const handleComplete = () => {
    onComplete(module.quiz ? score : undefined)
  }

  // Continue to next
  const handleNext = () => {
    if (showResults && module.quiz) {
      handleComplete()
    } else {
      onNext()
    }
  }

  // Render content based on type
  const renderContent = () => {
    switch (module.contentType) {
      case 'VIDEO':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            {module.contentUrl ? (
              <video
                controls
                className="w-full h-full rounded-lg"
                src={module.contentUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <Text>Video content not available</Text>
              </div>
            )}
          </div>
        )
      
      case 'PDF':
        return (
          <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
            {module.contentUrl ? (
              <iframe
                src={module.contentUrl}
                className="w-full h-full rounded-lg"
                title={module.title}
              />
            ) : (
              <div className="text-center text-gray-600">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <Text>PDF content not available</Text>
              </div>
            )}
          </div>
        )
      
      case 'TEXT':
        return (
          <div className="prose prose-lg max-w-none bg-white p-6 rounded-lg border">
            {module.contentBody ? (
              <div dangerouslySetInnerHTML={{ __html: module.contentBody }} />
            ) : (
              <Text>No text content available</Text>
            )}
          </div>
        )
      
      default:
        return <Text>Unsupported content type</Text>
    }
  }

  // Render quiz
  const renderQuiz = () => {
    if (!module.quiz) return null

    const currentQuestion = module.quiz.questions[currentQuestionIndex]
    if (!currentQuestion) return null

    if (showResults) {
      return renderQuizResults()
    }

    return (
      <Card className="p-6">
        <div className="mb-4">
          <Badge variant="soft" color="blue">
            Question {currentQuestionIndex + 1} of {module.quiz.questions.length}
          </Badge>
        </div>

        <Heading size="4" className="mb-4">
          {currentQuestion.text}
        </Heading>

        {renderQuestionInput(currentQuestion)}

        <div className="flex justify-between mt-6">
          <Button
            variant="soft"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          >
            Previous
          </Button>

          {currentQuestionIndex === module.quiz.questions.length - 1 ? (
            <Button onClick={submitQuiz}>
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={!answers[currentQuestion.id]}
            >
              Next Question
            </Button>
          )}
        </div>
      </Card>
    )
  }

  // Render question input based on type
  const renderQuestionInput = (question: Question) => {
    const currentAnswer = answers[question.id]

    switch (question.type) {
      case 'MCQ':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Text>{option}</Text>
              </label>
            ))}
          </div>
        )

      case 'TF':
        return (
          <div className="space-y-3">
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Text>{option}</Text>
              </label>
            ))}
          </div>
        )

      case 'SHORT':
        return (
          <input
            type="text"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case 'FILL':
        return (
          <input
            type="text"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
            placeholder="Fill in the blank..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      default:
        return <Text>Unsupported question type</Text>
    }
  }

  // Render quiz results
  const renderQuizResults = () => {
    if (!module.quiz) return null

    const passed = score >= module.quiz.passingScore
    const totalQuestions = module.quiz.questions.length

    return (
      <Card className="p-6">
        <div className="text-center mb-6">
          {passed ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          
          <Heading size="4" className="mb-2">
            {passed ? 'Quiz Completed!' : 'Quiz Failed'}
          </Heading>
          
          <Text size="3" color="gray">
            Score: {score}% ({module.quiz.questions.filter(q => 
              isAnswerCorrect(q, answers[q.id])
            ).length}/{totalQuestions} correct)
          </Text>
          
          {!passed && (
            <Text size="2" color="red" className="mt-2">
              Passing score: {module.quiz.passingScore}%
            </Text>
          )}
        </div>

        <div className="text-center">
          <Button onClick={handleComplete} className="mr-3">
            {passed ? 'Continue' : 'Review Answers'}
          </Button>
        </div>
      </Card>
    )
  }

  // Render funnel
  const renderFunnel = () => {
    if (!module.funnel) return null

    const { type, config } = module.funnel

    switch (type) {
      case 'CALENDLY':
        return (
          <Card className="p-6 text-center">
            <Heading size="4" className="mb-4">
              Schedule a Session
            </Heading>
            <Text className="mb-4">
              {config.description || 'Book a time to discuss this topic further'}
            </Text>
            <Button asChild>
              <a href={config.url} target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
          </Card>
        )

      case 'LINK':
        return (
          <Card className="p-6 text-center">
            <Heading size="4" className="mb-4">
              {config.title || 'Learn More'}
            </Heading>
            <Text className="mb-4">
              {config.description || 'Click below to access additional resources'}
            </Text>
            <Button asChild>
              <a href={config.url} target="_blank" rel="noopener noreferrer">
                {config.label || 'Visit Resource'}
              </a>
            </Button>
          </Card>
        )

      case 'UPGRADE':
        return (
          <Card className="p-6 text-center">
            <Heading size="4" className="mb-4">
              {config.title || 'Upgrade Your Plan'}
            </Heading>
            <Text className="mb-4">
              {config.description || 'Get access to premium features and content'}
            </Text>
            <Button asChild>
              <a href={config.url} target="_blank" rel="noopener noreferrer">
                {config.label || 'Upgrade Now'}
              </a>
            </Button>
          </Card>
        )

      default:
        return null
    }
  }

  // Render progress and navigation
  const renderProgress = () => {
    return (
      <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <Button
            variant="soft"
            disabled={!hasPrevious}
            onClick={onPrevious}
          >
            Previous
          </Button>
          
          <Text size="2" color="gray">
            Module {module.orderIndex + 1}
          </Text>
        </div>

        <div className="flex items-center space-x-4">
          {isStarted && (
            <Text size="2" color="gray">
              Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </Text>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!hasNext && !showResults}
          >
            {showResults ? 'Continue' : hasNext ? 'Next' : 'Complete'}
          </Button>
        </div>
      </div>
    )
  }

  // Main render
  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <Heading size="6" className="mb-4">
            {module.title}
          </Heading>
          <Text size="3" color="gray" className="mb-6">
            Ready to start this module? Click the button below to begin.
          </Text>
          <Button onClick={startLesson} size="3">
            Start Module
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Content Section */}
      <div>
        <Heading size="5" className="mb-4">
          {module.title}
        </Heading>
        {renderContent()}
      </div>

      {/* Interactive Section */}
      <div>
        {module.quiz && renderQuiz()}
        {!module.quiz && module.funnel && renderFunnel()}
      </div>

      {/* Progress & Navigation */}
      {renderProgress()}
    </div>
  )
}

