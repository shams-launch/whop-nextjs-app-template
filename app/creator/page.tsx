"use client";

import { Card, CardContent } from "frosted-ui";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          👩‍🏫 Creator Dashboard
        </h1>
        <p className="text-slate-600 mb-10">
          Manage your lessons, create quizzes, and view learner analytics.
        </p>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lessons card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">📚 Manage Lessons</h2>
              <p className="text-slate-600 mb-6">
                Create and edit your lessons for learners.
              </p>
              <Link href="/creator/lessons">
                <Button className="w-full">Go to Lessons</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quizzes card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Generate Quizzes</h2>
              <p className="text-slate-600 mb-6">
                Use AI to generate quizzes based on course content.
              </p>
              <Link href="/creator/lessons/new">
                <Button className="w-full">Create Quiz</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analytics card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Analytics</h2>
              <p className="text-slate-600 mb-6">
                Track learner progress and performance.
              </p>
              <Link href="/creator/analytics">
                <Button className="w-full">View Analytics</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

