'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Heading, Text, Button, Card, Flex, Progress, Badge, Alert } from '@frosted-ui/react'
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

export default function QuizPage({ params }: { params: { quizId: string } }) {
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
  }, [params.quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/learner/quizzes/${params.quizId}`)
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
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setIsCorrect(false)
      setShowFeedback(false)
      setFeedback('')
    } else {
      // Quiz completed
      handleCompleteQuiz()
    }
  }

  const handleCompleteQuiz = async () => {
    try {
      const finalScore = Math.round((score / totalQuestions) * 100)
      const response = await fetch('/api/learner/quizzes/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: params.quizId,
          score: finalScore,
          totalQuestions
        })
      })

      if (response.ok) {
        router.push(`/learner/quizzes/${params.quizId}/results?score=${finalScore}`)
      }
    } catch (error) {
      console.error('Error completing quiz:', error)
    }
  }

  if (loading) {
    return (
      <Container size="3" className="py-8">
        <Card className="p-8 text-center">
          <Text size="4">Loading quiz...</Text>
        </Card>
      </Container>
    )
  }

  if (error || !quiz) {
    return (
      <Container size="3" className="py-8">
        <Card className="p-8 text-center">
          <Text size="4" color="red">{error || 'Quiz not found'}</Text>
          <Link href="/learner/lessons">
            <Button size="3" className="mt-4">Back to Lessons</Button>
          </Link>
        </Card>
      </Container>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  return (
    <Container size="3" className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/learner/lessons">
          <Button size="2" variant="soft" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Link>
        
        <Heading size="6" className="mb-2">{quiz.title}</Heading>
        {quiz.description && (
          <Text size="3" color="gray" className="mb-4">{quiz.description}</Text>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Score: {score}/{totalQuestions}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 mb-6">
        <Progress value={progress} className="w-full" />
        <Text size="2" color="gray" className="mt-2">
          {currentQuestionIndex + 1} of {totalQuestions} questions
        </Text>
      </Card>

      {/* Question */}
      <Card className="p-6 mb-6">
        <Heading size="4" className="mb-6">
          {currentQuestion.questionText}
        </Heading>

        <div className="space-y-3">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? isAnswered
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <Flex gap="3" align="center">
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <Text size="3" weight="medium">
                  {String.fromCharCode(65 + index)}. {choice}
                </Text>
              </Flex>
            </button>
          ))}
        </div>
      </Card>

      {/* AI Feedback */}
      {showFeedback && feedback && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <Flex gap="3" align="center" className="mb-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <Text size="3" weight="medium">AI Feedback</Text>
          </Flex>
          <Text size="2" color="gray">{feedback}</Text>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <div>
          {!isAnswered && (
            <Button 
              size="3" 
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          )}
        </div>
        
        <div>
          {isAnswered && (
            <Button size="3" onClick={handleNextQuestion}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}

