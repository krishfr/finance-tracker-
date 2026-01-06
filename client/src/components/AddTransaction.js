// src/components/AddTransaction.jsx
import { useState } from "react";
import { apiRequest } from "../api";

function AddTransaction({ fetchTransactions }) {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || isNaN(amount)) {
      setError("Enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/transactions", {
        method: "POST",
        body: JSON.stringify({
          type,
          amount: Number(amount),
          category,
        }),
      });

      setAmount("");
      setCategory("salary");
      setType("income");

      await fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm backdrop-blur p-5">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Add Transaction
      </h3>

      {error && (
        <p className="mb-3 text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`rounded-xl border px-3 py-2 transition 
              ${
                type === "income"
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200"
              }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`rounded-xl border px-3 py-2 transition 
              ${
                type === "expense"
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200"
              }`}
          >
            Expense
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount in ₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500"
          >
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="food">Food</option>
            <option value="rent">Rent</option>
            <option value="groceries">Groceries</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 shadow-sm transition-colors"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;
