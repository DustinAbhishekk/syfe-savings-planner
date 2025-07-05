import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiDollarSign,
  FiTarget,
  FiCalendar,
  FiInfo,
} from "react-icons/fi";
import CurrencyInput from "react-currency-input-field";

type Goal = {
  id: string;
  name: string;
  currency: "INR" | "USD";
  targetAmount: number;
  savedAmount: number;
  progressPercent: number;
  targetDate: string | null;
  createdAt: string;
};

interface AddGoalFormProps {
  setShowForm: (show: boolean) => void;
  onAddGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  exchangeRate: number;
  defaultCurrency?: "INR" | "USD";
}

function AddGoalForm({
  setShowForm,
  onAddGoal,
  exchangeRate,
  defaultCurrency = "INR",
}: AddGoalFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currency: defaultCurrency,
    targetDate: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState("0.00");

  // Calculate converted amount whenever relevant fields change
  useEffect(() => {
    if (formData.targetAmount) {
      const amount = parseFloat(formData.targetAmount.replace(/,/g, "")) || 0;
      const converted =
        formData.currency === "USD"
          ? (amount * exchangeRate).toFixed(2)
          : (amount / exchangeRate).toFixed(2);
      setConvertedAmount(converted);
    } else {
      setConvertedAmount("0.00");
    }
  }, [formData.targetAmount, formData.currency, exchangeRate]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      targetAmount: "",
      targetDate: "",
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
      isValid = false;
    }

    // Amount validation
    const amountValue = parseFloat(formData.targetAmount.replace(/,/g, ""));
    if (!formData.targetAmount) {
      newErrors.targetAmount = "Target amount is required";
      isValid = false;
    } else if (isNaN(amountValue)) {
      newErrors.targetAmount = "Must be a valid number";
      isValid = false;
    } else if (amountValue <= 0) {
      newErrors.targetAmount = "Amount must be positive";
      isValid = false;
    } else if (amountValue > 1000000000) {
      newErrors.targetAmount = "Amount is too large";
      isValid = false;
    } else if (formData.currency === "INR" && amountValue < 100) {
      newErrors.targetAmount = "Minimum amount is ₹100";
      isValid = false;
    } else if (formData.currency === "USD" && amountValue < 1) {
      newErrors.targetAmount = "Minimum amount is $1";
      isValid = false;
    }

    // Date validation (only if provided)
    if (formData.targetDate) {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.targetDate = "Date cannot be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const amountValue = parseFloat(formData.targetAmount.replace(/,/g, ""));

      const newGoal = {
        name: formData.name,
        currency: formData.currency,
        targetAmount: amountValue,
        savedAmount: 0,
        progressPercent: 0,
        targetDate: formData.targetDate || null,
      };

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async operation
      onAddGoal(newGoal);

      // Reset form on success
      setFormData({
        name: "",
        targetAmount: "",
        currency: defaultCurrency,
        targetDate: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmountChange = (value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      targetAmount: value || "",
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => !isSubmitting && setShowForm(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-5 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Savings Goal
            </h2>
            <button
              onClick={() => !isSubmitting && setShowForm(false)}
              className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
              disabled={isSubmitting}
              aria-label="Close form"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you saving for?
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dream vacation, Emergency fund"
                  className={`w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  disabled={isSubmitting}
                  maxLength={50}
                />
                <FiTarget className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              <div className="flex justify-between mt-1">
                {errors.name ? (
                  <p className="text-sm text-red-600">{errors.name}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Give your goal a descriptive name
                  </p>
                )}
                <span className="text-xs text-gray-400">
                  {formData.name.length}/50
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount
              </label>
              <div className="flex gap-2">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 ${
                    errors.targetAmount
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <div className="relative flex-1">
                  <CurrencyInput
                    name="targetAmount"
                    value={formData.targetAmount}
                    onValueChange={handleAmountChange}
                    placeholder={`e.g. ${
                      formData.currency === "INR" ? "50,000" : "1,000"
                    }`}
                    decimalsLimit={2}
                    decimalScale={2}
                    className={`w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 ${
                      errors.targetAmount
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                    disabled={isSubmitting}
                    prefix={formData.currency === "INR" ? "₹ " : "$ "}
                  />
                  <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                {errors.targetAmount ? (
                  <p className="text-sm text-red-600">{errors.targetAmount}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {formData.currency === "USD" ? (
                      <span>≈ ₹{convertedAmount}</span>
                    ) : (
                      <span>≈ ${convertedAmount}</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiInfo className="mr-1" />
                {showAdvanced
                  ? "Hide advanced options"
                  : "Add target date (optional)"}
              </button>
            </div>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="targetDate"
                        value={formData.targetDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 ${
                          errors.targetDate
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-200"
                        }`}
                        disabled={isSubmitting}
                      />
                      <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    {errors.targetDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.targetDate}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-lg cursor-pointer transition-colors font-medium flex items-center gap-2 ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Goal"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddGoalForm;
export type { Goal };
