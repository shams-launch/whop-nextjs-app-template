import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface QuizQuestion {
  question: string
  choices: string[]
  correctAnswer: number
  explanation: string
}

/**
 * Generate quiz questions from content using OpenAI
 */
export async function generateQuizQuestions(content: string, numQuestions: number = 5): Promise<QuizQuestion[]> {
  try {
    const prompt = `
Generate ${numQuestions} multiple-choice questions based on the following content. 
Each question should have 4 choices (A, B, C, D) with only one correct answer.

Content: ${content}

Return the response as a JSON array with the following structure:
[
  {
    "question": "Question text here?",
    "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "correctAnswer": 0,
    "explanation": "Explanation of why this answer is correct"
  }
]

Make sure the questions are relevant, challenging but fair, and cover different aspects of the content.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educator who creates high-quality multiple-choice questions. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const questions = JSON.parse(response) as QuizQuestion[]
    return questions
  } catch (error) {
    console.error('Error generating quiz questions:', error)
    throw new Error('Failed to generate quiz questions')
  }
}

/**
 * Generate AI feedback for wrong answers
 */
export async function generateWrongAnswerFeedback(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  lessonContent?: string
): Promise<string> {
  try {
    const prompt = `
A student answered a question incorrectly. Please provide helpful, encouraging feedback that explains why their answer was wrong and guides them toward the correct answer.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}
${lessonContent ? `Relevant Lesson Content: ${lessonContent}` : ''}

Provide a brief, encouraging explanation (2-3 sentences) that:
1. Acknowledges their effort
2. Explains why their answer was incorrect
3. Provides a hint or explanation about the correct answer
4. Encourages them to review the material

Keep the tone positive and educational.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a supportive and encouraging teacher who helps students learn from their mistakes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Great effort! Keep learning and you\'ll get it next time.'
  } catch (error) {
    console.error('Error generating feedback:', error)
    return 'Great effort! Keep learning and you\'ll get it next time.'
  }
}

/**
 * Generate lesson recommendations based on quiz performance
 */
export async function generateLessonRecommendations(
  missedTopics: string[],
  availableLessons: string[]
): Promise<string[]> {
  try {
    const prompt = `
Based on the topics a student struggled with, recommend specific lessons they should review.

Missed Topics: ${missedTopics.join(', ')}
Available Lessons: ${availableLessons.join(', ')}

Return only the lesson titles that would be most helpful for the student to review, as a JSON array of strings.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an educational advisor who recommends relevant learning materials."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      return []
    }

    return JSON.parse(response) as string[]
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return []
  }
}

