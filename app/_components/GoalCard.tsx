import React from "react";

interface GoalCardProps {
  name: string;
  currency: "INR" | "USD";
  targetAmount: number;
  convertedAmount: number;
  savedAmount: number;
  progressPercent: number; // from 0 to 100
}

const GoalCard: React.FC<GoalCardProps> = ({
  name,
  currency,
  targetAmount,
  convertedAmount,
  savedAmount,
  progressPercent,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 w-full max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">
          Target: {currency === "INR" ? "₹" : "$"}
          {targetAmount.toLocaleString()}
          <span className="ml-2 text-gray-400">
            (~ {currency === "INR" ? "$" : "₹"}
            {convertedAmount.toLocaleString()})
          </span>
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-1">
          Saved: {currency === "INR" ? "₹" : "$"}
          {savedAmount.toLocaleString()}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-right text-gray-500 mt-1">
          {progressPercent.toFixed(0)}% complete
        </p>
      </div>

      <div className="text-right">
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          Add Contribution
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
