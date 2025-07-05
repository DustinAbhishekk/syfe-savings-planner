import React, { useState } from "react";
import { FiDollarSign, FiCalendar } from "react-icons/fi";
import CurrencyInput from "react-currency-input-field";

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "INR" | "USD";
  onAddContribution: (amount: number, date: string) => void;
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  onClose,
  currency,
  onAddContribution,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse amount after removing any formatting
    const numericAmount = parseFloat(amount.replace(/,/g, ""));

    // Validation
    if (!amount || isNaN(numericAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (numericAmount <= 0) {
      setError("Amount must be positive");
      return;
    }

    // Call parent handler
    onAddContribution(numericAmount, date);

    // Reset and close
    setAmount("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Contribution
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({currencySymbol})
            </label>
            <div className="relative">
              <CurrencyInput
                value={amount}
                onValueChange={(value) => setAmount(value || "")}
                placeholder={`e.g. 1000`}
                decimalsLimit={2}
                decimalScale={2}
                className={`w-full border rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  error ? "border-red-500" : ""
                }`}
                prefix={currencySymbol + " "}
              />
              <FiDollarSign className="absolute left-2 top-3 text-gray-400" />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
                max={new Date().toISOString().split("T")[0]}
              />
              <FiCalendar className="absolute left-2 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white cursor-pointer rounded-md hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;
