'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heading, Text, Button, Card, Progress, Badge } from 'frosted-ui'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  questionText: string
  choices: string[]
  correctAnswer: number
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export default function QuizClient({ quizId }: { quizId: string }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/learner/quizzes/${quizId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch quiz')
      }
      const data = await response.json()
      setQuiz(data)
      setTotalQuestions(data.questions.length)
      setLoading(false)
    } catch (error) {
      setError('Failed to load quiz')
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return

    const currentQuestion = quiz?.questions[currentQuestionIndex]
    if (!currentQuestion) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      setScore(score + 1)
    } else {
      // Generate AI feedback for wrong answers
      try {
        const response = await fetch('/api/ai/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQuestion.questionText,
            correctAnswer: currentQuestion.choices[currentQuestion.correctAnswer],
            userAnswer: currentQuestion.choices[selectedAnswer],
            explanation: currentQuestion.explanation
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setFeedback(data.feedback)
          setShowFeedback(true)
        }
      } catch (error) {
        console.error('Error generating feedback:', error)
      }
    }
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    setFeedback('')
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(false)
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    try {
      const response = await fetch('/api/learner/quizzes/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz?.id,
          score,
          totalQuestions
        })
      })
      
      if (response.ok) {
        // Quiz completion recorded successfully
        console.log('Quiz completed successfully')
      }
    } catch (error) {
      console.error('Error completing quiz:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text size="3" color="gray">Loading quiz...</Text>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <Heading size="6" className="mb-2">Error Loading Quiz</Heading>
          <Text size="3" color="gray" className="mb-4">{error}</Text>
          <Link href="/learner/lessons">
            <Button size="3">Back to Lessons</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Heading size="6" className="mb-2">Quiz Not Found</Heading>
          <Text size="3" color="gray" className="mb-4">
            The quiz you're looking for doesn't exist or you don't have access to it.
          </Text>
          <Link href="/learner/lessons">
            <Button size="3">Back to Lessons</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/learner/lessons">
          <Button variant="ghost" size="2" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Link>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading size="8" className="mb-2">{quiz.title}</Heading>
            {quiz.description && (
              <Text size="3" color="gray">{quiz.description}</Text>
            )}
          </div>
          <Badge color="blue" size="2">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-4" />
        
        {/* Score Display */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>Score: {score}/{currentQuestionIndex + 1}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Progress: {Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 mb-6">
        <Heading size="6" className="mb-6">
          {currentQuestion.questionText}
        </Heading>

        <div className="space-y-3 mb-6">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border transition-all ${
                selectedAnswer === index
                  ? isAnswered
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isAnswered && index === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                <span>{choice}</span>
              </div>
            </button>
          ))}
        </div>

        {!isAnswered && selectedAnswer !== null && (
          <Button 
            onClick={handleSubmitAnswer}
            size="3"
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {isAnswered && (
          <div className="space-y-4">
            {isCorrect ? (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <Text weight="bold" color="green">Correct!</Text>
                    {currentQuestion.explanation && (
                      <Text size="2" color="gray">{currentQuestion.explanation}</Text>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <Text weight="bold" color="red">Incorrect</Text>
                    <Text size="2" color="gray">
                      The correct answer is: {currentQuestion.choices[currentQuestion.correctAnswer]}
                    </Text>
                    {currentQuestion.explanation && (
                      <Text size="2" color="gray">{currentQuestion.explanation}</Text>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showFeedback && feedback && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <Text weight="bold" color="blue" size="2">AI Feedback</Text>
                    <Text size="2" color="gray">{feedback}</Text>
                  </div>
                </div>
              </Card>
            )}

            <Button 
              onClick={handleNextQuestion}
              size="3"
              className="w-full"
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
            </Button>
          </div>
        )}
      </Card>

      {/* Quiz Completion */}
      {isAnswered && isLastQuestion && (
        <Card className="p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <Heading size="8" className="mb-2">Quiz Completed!</Heading>
          <Text size="5" color="gray" className="mb-4">
            You scored {score} out of {totalQuestions} questions
          </Text>
          <div className="mb-6">
            <Text size="6" weight="bold" color="blue">
              {Math.round((score / totalQuestions) * 100)}%
            </Text>
          </div>
          <Link href="/learner/lessons">
            <Button size="3">Back to Lessons</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
