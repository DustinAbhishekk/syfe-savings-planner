import React from "react";

interface DashboardHeaderProps {
  totalTarget: number;
  totalSaved: number;
  overallProgress: number; // percentage (0–100)
  currencySymbol: string; // e.g. ₹ or $
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalTarget,
  totalSaved,
  overallProgress,
  currencySymbol,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 shadow-sm mb-6 ">
      <div className=" flex justify-between">
        <h3 className="text-xs text-[#888] mb-4">Financial Overview</h3>
        <button className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition ">
         Refresh Rate
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        {/* Totals */}
        <div className="">
          <p className="text-sm text-gray-600 ">🏁 Total Target</p>
          <p className="text-lg font-semibold text-gray-800">
            {currencySymbol}
            {totalTarget.toLocaleString()}
          </p>
          <p className="text-sm text-[#888]">placeholder</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">💰 Total Saved</p>
          <p className="text-lg font-semibold text-gray-800">
            {currencySymbol}
            {totalSaved.toLocaleString()}
          </p>
          <p className="text-sm text-[#888]">placeholder</p>
        </div>
        {/* Overall Progress */}
        <div className="w-full sm:w-1/3">
          <p className="text-sm text-gray-600 mb-1">📊 Overall Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-500 mt-1">
            {overallProgress.toFixed(0)}% complete
          </p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between">
        <h6 className="text-xs text-[#888] mt-4">
          Exchange Rate (placeholder)
        </h6>
        <h6 className="text-xs text-[#888] mt-4 ">
          Exchange Rate (placeholder)
        </h6>
      </div>
    </div>
  );
};

export default DashboardHeader;
