import { useState } from "react";


type Goal = {
  name: string;
  currency: "INR" | "USD";
  targetAmount: number;
  convertedAmount: number;
  savedAmount: number;
  progressPercent: number;
};

interface AddGoalFormProps {
  setShowForm: (show: boolean) => void;
  onAddGoal: (goal: Goal) => void;
}

function AddGoalForm({ setShowForm, onAddGoal }: AddGoalFormProps) {
  const [trip, setTrip] = useState("");
  const [target, setTarget] = useState("");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGoal: Goal = {
      name: trip,
      currency,
      targetAmount: Number(target),
      convertedAmount:
        currency === "USD" ? Number(target) * 83.4 : Number(target) / 83.4,
      savedAmount: 0,
      progressPercent: 0,
    };

    onAddGoal(newGoal); // Call parent function to store the goal
    setShowForm(false); // Close the form

    // Optionally clear fields
    setTrip("");
    setTarget("");
    setCurrency("INR");
  };

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="goal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal Name
          </label>
          <input
            type="text"
            name="goal"
            id="goal"
            required
            value={trip}
            onChange={(e) => setTrip(e.target.value)}
            placeholder="e.g. Trip to Japan"
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Target
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            placeholder="e.g. 5000"
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Currency (INR/USD)
          </label>
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "INR" | "USD")}
            className="w-full border rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Add Goal
        </button>
      </form>
    </div>
  );
}

export default AddGoalForm;
export type { Goal };
