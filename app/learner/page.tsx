"use client";

import { Card, CardContent } from "frosted-ui";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearnerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          🎓 Welcome to MasteryFlow
        </h1>
        <p className="text-slate-600 mb-10">
          Continue your learning journey. Select a lesson or take a quiz.
        </p>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lessons card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">📚 Lessons</h2>
              <p className="text-slate-600 mb-6">
                Explore lessons created by your instructors.
              </p>
              <Link href="/learner/lessons">
                <Button className="w-full">View Lessons</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quizzes card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Quizzes</h2>
              <p className="text-slate-600 mb-6">
                Test your knowledge and track your progress.
              </p>
              <Link href="/learner/quizzes">
                <Button className="w-full">Take a Quiz</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

