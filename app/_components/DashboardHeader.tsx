import React from "react";
import { motion } from "framer-motion";
import {
  FiRefreshCw,
  FiTrendingUp,
  FiTarget,
  FiDollarSign,
} from "react-icons/fi";

interface DashboardHeaderProps {
  totalTarget?: number;
  totalSaved?: number;
  overallProgress?: number;
  currencySymbol?: string;
  exchangeRate?: number;
  lastUpdated?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}


const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalTarget = 0,
  totalSaved = 0,
  overallProgress = 0,
  currencySymbol = "₹",
  exchangeRate = 83.5,
  lastUpdated = new Date().toISOString(),
  onRefresh = () => {},
  isLoading = false,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = React.useState("just now");

  // Calculate time since last update
  React.useEffect(() => {
    const updateTimeText = () => {
      try {
        const now = new Date();
        const updatedAt = new Date(lastUpdated);
        const diffInSeconds = Math.floor(
          (now.getTime() - updatedAt.getTime()) / 1000
        );

        if (diffInSeconds < 60) {
          setTimeSinceUpdate("just now");
        } else if (diffInSeconds < 3600) {
          setTimeSinceUpdate(`${Math.floor(diffInSeconds / 60)} min ago`);
        } else {
          setTimeSinceUpdate(
            `${Math.floor(diffInSeconds / 3600)} hour${
              diffInSeconds >= 7200 ? "s" : ""
            } ago`
          );
        }
      } catch {
        setTimeSinceUpdate("recently");
      }
    };

    updateTimeText();
    const interval = setInterval(updateTimeText, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Safe exchange rate formatting with fallbacks
  const safeExchangeRate = exchangeRate || 83.5;
  const formattedInrRate = `1 USD = ${safeExchangeRate.toFixed(2)} INR`;
  const formattedUsdRate = `1 INR = ${(1 / safeExchangeRate).toFixed(4)} USD`;

  // Format currency values safely
  const formatCurrency = (value: number) => {
    try {
      return value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
    } catch {
      return value.toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Savings Dashboard
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track your financial goals progress
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg text-sm font-medium ${
            isLoading || isRefreshing
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors`}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
          >
            <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
          </motion.div>
          {isLoading || isRefreshing ? "Refreshing..." : "Refresh Rates"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Target Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FiTarget size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Target</p>
              <motion.p
                key={`target-${totalTarget}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-gray-800"
              >
                {currencySymbol}
                {formatCurrency(totalTarget)}
              </motion.p>
            </div>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </motion.div>

        {/* Total Saved Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <FiDollarSign size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Saved</p>
              <motion.p
                key={`saved-${totalSaved}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-gray-800"
              >
                {currencySymbol}
                {formatCurrency(totalSaved)}
              </motion.p>
            </div>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (totalSaved / Math.max(totalTarget, 1)) * 100
                )}%`,
              }}
            />
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <FiTrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Overall Progress
              </p>
              <motion.p
                key={`progress-${overallProgress}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-gray-800"
              >
                {Math.min(100, overallProgress).toFixed(1)}%
              </motion.p>
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100">
                  {Math.min(100, overallProgress).toFixed(0)}% Complete
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-2 flex rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(overallProgress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-xs"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Exchange Rate Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Last updated: {timeSinceUpdate}
          </span>
          {isLoading && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
              Live updating...
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-2 sm:mt-0">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
            <span className="text-xs font-medium text-blue-600">USD/INR</span>
            <span className="text-sm font-semibold text-gray-700">
              {formattedInrRate}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
            <span className="text-xs font-medium text-green-600">INR/USD</span>
            <span className="text-sm font-semibold text-gray-700">
              {formattedUsdRate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
