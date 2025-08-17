'use client'

import { Card, Heading, Text, Button, Badge } from 'frosted-ui'
import { BookOpen, Trophy, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LearnerDashboard() {
  // Mock data - in production this would come from API
  const mockProgress = {
    lessonsCompleted: 7,
    dayStreak: 12,
    averageScore: 85,
    courseProgress: 65
  }

  const mockAchievements = [
    {
      id: '1',
      title: 'Perfect Quiz!',
      description: 'Scored 100% on Advanced Techniques',
      icon: '🏆',
      color: 'yellow'
    },
    {
      id: '2',
      title: 'Course Explorer',
      description: 'Completed 5 lessons in a week',
      icon: '📚',
      color: 'blue'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Heading size="5">My Learning Dashboard</Heading>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Progress Overview */}
        <Card className="p-6">
          <Heading size="5" className="mb-4">Your Progress</Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Text size="6" weight="bold" color="blue">{mockProgress.lessonsCompleted}</Text>
              <Text size="2" color="gray">Lessons Completed</Text>
            </div>
            <div className="text-center">
              <Text size="6" weight="bold" color="green">{mockProgress.dayStreak}</Text>
              <Text size="2" color="gray">Day Streak</Text>
            </div>
            <div className="text-center">
              <Text size="6" weight="bold" color="purple">{mockProgress.averageScore}%</Text>
              <Text size="2" color="gray">Average Score</Text>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mockProgress.courseProgress}%` }}></div>
          </div>
          <Text size="2" color="gray" className="mt-2">{mockProgress.courseProgress}% of course completed</Text>
        </Card>

        {/* Current Streak */}
        <Card className="p-6">
          <div className="flex gap-3 items-center mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <Heading size="5">Current Streak</Heading>
          </div>
          <div className="text-center">
            <Text size="8" weight="bold" color="yellow">{mockProgress.dayStreak}</Text>
            <Text size="4" color="gray">days</Text>
            <Text size="2" color="gray" className="mt-2">Keep it up! You're on fire! 🔥</Text>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <Heading size="5" className="mb-4">Continue Learning</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/learner/lessons">
              <Button size="3" className="w-full justify-between">
                <div className="flex gap-2 items-center">
                  <BookOpen className="w-4 h-4" />
                  Browse Lessons
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/learner/quizzes">
              <Button size="3" variant="soft" className="w-full justify-between">
                <div className="flex gap-2 items-center">
                  <Trophy className="w-4 h-4" />
                  Take Quiz
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/learner/progress">
              <Button size="3" variant="soft" className="w-full justify-between">
                <div className="flex gap-2 items-center">
                  <TrendingUp className="w-4 h-4" />
                  View Progress
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/learner/leaderboard">
              <Button size="3" variant="soft" className="w-full justify-between">
                <div className="flex gap-2 items-center">
                  <Users className="w-4 h-4" />
                  Leaderboard
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="p-6">
          <Heading size="5" className="mb-4">Recent Achievements</Heading>
          <div className="space-y-3">
            {mockAchievements.map(achievement => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <Text size="3" weight="medium">{achievement.title}</Text>
                  <Text size="2" color="gray">{achievement.description}</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

