"use client";

import { useState } from "react";
import AddGoalForm, { Goal } from "./AddGoalForm";
import DashboardHeader from "./DashboardHeader";
import GoalCard from "./GoalCard";

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  const handleOpen = () => {
    setShowForm(true);
  };

  const handleAddGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const overallProgress = goals.length
    ? Math.round(
        goals.reduce((sum, g) => sum + g.progressPercent, 0) / goals.length
      )
    : 0;

  return (
    <section>
      <h1 className="text-center mt-4 font-bold text-3xl text-gray-700">
        Syfe Savings Planner
      </h1>
      <p className="text-center mt-2 text-sm text-[#555]">
        Track your financial goals and build your future
      </p>

      <div className="mx-6 mt-4">
        <DashboardHeader
          totalTarget={totalTarget}
          totalSaved={totalSaved}
          overallProgress={overallProgress}
          currencySymbol="₹"
        />

        <div className="flex justify-between items-center mt-4">
          <h3 className="text-lg font-medium text-gray-700">Your Goals</h3>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            onClick={handleOpen}
          >
            Add Goal
          </button>
        </div>

        {showForm && (
          <div className="mt-6">
            <AddGoalForm setShowForm={setShowForm} onAddGoal={handleAddGoal} />
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {goals.length > 0 ? (
            goals.map((goal, index) => <GoalCard key={index} {...goal} />)
          ) : (
            <p className="text-gray-500">No goals yet. Start by adding one!</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
