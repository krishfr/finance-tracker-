import React from "react";

const AISummaryCard = ({ title, insights }) => {
  if (!insights) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm text-gray-500">
        Loading insights...
      </div>
    );
  }

  const {
    income = 0,
    expense = 0,
    savings = 0,
    expensePercent = 0,
    topCategory,
    topAmount,
  } = insights;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
      <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-100">
        🤖 {title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        This month you earned ₹{income.toFixed(2)} and spent ₹{expense.toFixed(2)}.
      </p>

      <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
        You saved ₹{savings.toFixed(2)}.
      </p>

      <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
        Expenses are {expensePercent}% of income.
      </p>

      {topCategory && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Highest spending category: {topCategory} (₹{topAmount.toFixed(2)})
        </p>
      )}
    </div>
  );
};

export default AISummaryCard;
