"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiDollarSign,
  FiCalendar,
  FiTrash2,
  FiEdit,
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical,
  FiLoader,
} from "react-icons/fi";
import CurrencyInput from "react-currency-input-field";

interface Contribution {
  id: string; 
  amount: number;
  date: string;
}
interface Goal {
  id: string;
  name: string;
  currency: "INR" | "USD";
  targetAmount: number;
  savedAmount: number;
  contributions: Contribution[];
}

interface GoalCardProps {
  id: string;
  name: string;
  currency: "INR" | "USD";
  targetAmount: number;
  savedAmount: number;
  contributions: Contribution[];
  onAddContribution?: (amount: number, date: string) => void;
  onDeleteGoal?: (id: string) => void;
  onEditGoal?: (id: string, updatedGoal: Partial<Goal>) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  id,
  name,
  currency = "INR",
  targetAmount = 0,
  savedAmount = 0,
  contributions = [],
  onAddContribution,
  onDeleteGoal,
  onEditGoal,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showContributions, setShowContributions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [editedName, setEditedName] = useState(name);
  const [editedTarget, setEditedTarget] = useState(targetAmount.toString());
  const [isProcessing, setIsProcessing] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatCurrency = (value: number): string => {
    return value
      .toLocaleString("en-IN", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
      .replace(/^(\D+)/, currency === "INR" ? "₹" : "$");
  };

  const calculateProgress = (): number => {
    if (targetAmount <= 0) return 0;
    const progress = (savedAmount / targetAmount) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const handleAddContribution = async () => {
    const numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));

    if (!amount || isNaN(numericAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (numericAmount <= 0) {
      setError("Amount must be positive");
      return;
    }

    setIsProcessing(true);
    try {
      if (onAddContribution) {
        await onAddContribution(numericAmount, date);
      }
      setShowModal(false);
      setAmount("");
      setError("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteGoal = async () => {
    setIsProcessing(true);
    try {
      if (onDeleteGoal) {
        await onDeleteGoal(id);
      }
      setShowDeleteConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditGoal = async () => {
    setIsProcessing(true);
    try {
      if (onEditGoal) {
        await onEditGoal(id, {
          name: editedName,
          targetAmount: parseFloat(editedTarget),
        });
      }
      setShowEditForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const currencySymbol = currency === "INR" ? "₹" : "$";
  const remainingAmount = Math.max(0, targetAmount - savedAmount);
  const progress = calculateProgress();
  const isComplete = progress >= 100;

  return (
    <>
      {/* Goal Card */}
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md mx-auto border border-gray-100 relative transition-all"
      >
        {/* Edit/Delete Menu - Now with better spacing and click-outside behavior */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-gray-700 p-1 mt-1 rounded-full cursor-pointer transition-colors"
            aria-label="More options"
          >
            <FiMoreVertical size={20} />
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowEditForm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiEdit className="mr-2" size={16} />
                    Edit Goal
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <FiTrash2 className="mr-2" size={16} />
                    Delete Goal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content with better spacing */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {name || "Unnamed Goal"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">
              Target: {formatCurrency(targetAmount)}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full mr-4 text-xs font-medium flex-shrink-0 ${
              isComplete
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {progress.toFixed(0)}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">
              Saved: {formatCurrency(savedAmount)}
            </span>
            <span className="text-gray-600">
              Remaining: {formatCurrency(remainingAmount)}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, type: "spring" }}
              className={`h-full rounded-full ${
                isComplete ? "bg-green-500" : "bg-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Contributions Section */}
        <div className="mb-4">
          <motion.button
            whileHover={{ backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowContributions(!showContributions)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer w-full p-2 rounded-lg transition-colors"
          >
            {showContributions ? (
              <>
                <FiChevronUp size={16} className="transition-transform" />
                <span>Hide Contributions</span>
              </>
            ) : (
              <>
                <FiChevronDown size={16} className="transition-transform" />
                <span>Show Contributions ({contributions.length})</span>
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {showContributions && contributions.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Contribution History
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {contributions
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((contribution) => (
                        <motion.div
                          key={contribution.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-600">
                            {new Date(contribution.date).toLocaleDateString()}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(contribution.amount)}
                          </span>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Contribution Button */}
        {onAddContribution && (
          <div className="flex justify-end">
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer shadow-sm"
            >
              {isProcessing && showModal ? (
                <>
                  <FiLoader className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  Add Contribution
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Add Contribution Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => !isProcessing && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Contribution to {name || "this goal"}
                </h3>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({currencySymbol})
                  </label>
                  <div className="relative">
                    <CurrencyInput
                      value={amount}
                      onValueChange={(value) => setAmount(value || "")}
                      placeholder={`Enter amount in ${currency}`}
                      decimalsLimit={2}
                      decimalScale={2}
                      className={`w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 ${
                        error
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      prefix={currencySymbol + " "}
                    />
                    <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      if (!isProcessing) {
                        setShowModal(false);
                        setError("");
                      }
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 text-gray-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleAddContribution}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Contribution"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => !isProcessing && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Goal
                </h3>
              </div>

              <div className="p-5">
                <p className="text-gray-600 mb-6">
                  {'Are you sure you want to delete "' +
                    name +
                    '"? This action cannot be undone.'}
                </p>

                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => !isProcessing && setShowDeleteConfirm(false)}
                    disabled={isProcessing}
                    className="px-4 py-2 text-gray-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleDeleteGoal}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Goal"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {showEditForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => !isProcessing && setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Edit Goal
                </h3>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount ({currencySymbol})
                  </label>
                  <CurrencyInput
                    value={editedTarget}
                    onValueChange={(value) => setEditedTarget(value || "")}
                    placeholder={`Enter target amount`}
                    decimalsLimit={2}
                    decimalScale={2}
                    className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
                    prefix={currencySymbol + " "}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => !isProcessing && setShowEditForm(false)}
                    disabled={isProcessing}
                    className="px-4 py-2 text-gray-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleEditGoal}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GoalCard;
