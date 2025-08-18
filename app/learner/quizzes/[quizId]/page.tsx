import QuizClient from './QuizClient'

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params
  return <QuizClient quizId={quizId} />
}

