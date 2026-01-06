// src/components/TransactionList.jsx
import React from "react";
import { apiRequest } from "../api";

export default function TransactionList({ transactions, fetchTransactions }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this transaction?")) return;

    try {
      await apiRequest(`/transactions/${id}`, {
        method: "DELETE",
      });
      await fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-3 dark:text-slate-100">
          📋 Transaction History
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No transactions found for the current filters.  
          Add your first income or expense to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3">
        📋 Transaction History
      </h2>

      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income";
          const amountClass = isIncome
            ? "text-emerald-500"
            : "text-rose-500";

          const chipBg = isIncome
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-300";

          return (
            <div
              key={transaction.id}
              className="flex justify-between items-center px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`inline-flex items-center justify-center h-9 w-9 rounded-full ${chipBg}`}
                >
                  {isIncome ? "↑" : "↓"}
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {transaction.category}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`text-base font-bold tabular-nums text-right min-w-[110px] ${amountClass}`}
                >
                  {isIncome ? "+₹" : "-₹"}
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>

                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
