"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddGoalForm from "./AddGoalForm";
import DashboardHeader from "./DashboardHeader";
import GoalCard from "./GoalCard";
import { Goal, Contribution } from "../types";

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exchangeRate, setExchangeRate] = useState(83.5);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("savingsGoals");
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        if (Array.isArray(parsedGoals)) {
          const validatedGoals = parsedGoals.map((goal: any) => ({
            ...goal,
            savedAmount: goal.savedAmount || 0,
            contributions: goal.contributions || [],
          }));
          setGoals(validatedGoals);
        }
      } catch (e) {
        console.error("Failed to parse saved goals", e);
      }
    }
    fetchExchangeRate();
  }, []);

  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals));
  }, [goals]);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockRate = 83.5 + (Math.random() - 0.5);
      setExchangeRate(parseFloat(mockRate.toFixed(2)));
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      setExchangeRate(83.5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = (
    goal: Omit<Goal, "id" | "savedAmount" | "contributions">
  ) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      savedAmount: 0,
      contributions: [],
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    setShowForm(false);
  };

  const handleAddContribution = (
    goalId: string,
    amount: number,
    date: string
  ) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const newContribution: Contribution = {
            id: Date.now().toString(),
            amount,
            date,
          };
          const newSavedAmount = goal.savedAmount + amount;
          return {
            ...goal,
            savedAmount: newSavedAmount,
            contributions: [...goal.contributions, newContribution],
          };
        }
        return goal;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  const handleEditGoal = (goalId: string, updatedGoal: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            ...updatedGoal,
          };
        }
        return goal;
      })
    );
  };

  // Calculate dashboard totals
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const overallProgress =
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-8 pb-6 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Syfe Savings Planner
          </h1>
          <p className="mt-2 text-gray-600">
            Track your financial goals and build your future
          </p>
        </motion.div>

        <DashboardHeader
          totalTarget={totalTarget}
          totalSaved={totalSaved}
          overallProgress={overallProgress}
          currencySymbol={goals[0]?.currency === "USD" ? "$" : "₹"}
          exchangeRate={exchangeRate}
          lastUpdated={lastUpdated}
          onRefresh={fetchExchangeRate}
          isLoading={isLoading}
        />

        <div className="mt-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Goals</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Goal
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <AddGoalForm
              setShowForm={setShowForm}
              onAddGoal={handleAddGoal}
              exchangeRate={exchangeRate}
            />
          )}
        </AnimatePresence>

        <div className="mt-6">
          {goals.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  id={goal.id}
                  name={goal.name}
                  currency={goal.currency}
                  targetAmount={goal.targetAmount}
                  savedAmount={goal.savedAmount}
                  contributions={goal.contributions}
                  onAddContribution={(amount, date) =>
                    handleAddContribution(goal.id, amount, date)
                  }
                  onDeleteGoal={handleDeleteGoal}
                  onEditGoal={handleEditGoal}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-700">
                No goals yet
              </h3>
              <p className="mt-2 text-gray-500">
                Start by adding your first savings goal
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Your First Goal
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
