import { useEffect, useState, useMemo, useCallback } from "react";
import AuthPage from "./AuthPage";
import { apiRequest, getToken, clearToken } from "./api";

import AddTransaction from "./components/AddTransaction";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";
import MonthlyBarChart from "./components/MonthlyBarChart";
import ThemeToggle from "./components/ThemeToggle";
import CategoryChart from "./components/CategoryChart";
import AISummaryCard from "./components/AISummaryCard";
import { getCategoryInsights } from "./ai/categoryInsights";
import { getMonthlyInsights } from "./ai/monthlyInsights";
import { getTransactionInsights } from "./ai/transactionInsights";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
const [searchTerm, setSearchTerm] = useState("");
const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ===============================
  // 🔐 RESTORE USER ON REFRESH
  // ===============================
  useEffect(() => {
    const restoreUser = async () => {
      const token = getToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Ask backend who this token belongs to
        const me = await apiRequest("/auth/me");
        setUser(me);
      } catch (err) {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  // ===============================
  // 📥 FETCH TRANSACTIONS
  // ===============================
  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const data = await apiRequest("/transactions");
      const normalized = data.map((tx) => ({
        ...tx,
        amount: Number(tx.amount),
      }));
      setTransactions(normalized);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [user, fetchTransactions]);

 

  // ===============================
  // 📊 FILTERING
  // ===============================
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const type = txn.type?.toLowerCase();
      const category = txn.category?.toLowerCase();

      const matchesType = filterType === "all" || type === filterType;
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      return matchesType && matchesCategory;
    });
  }, [transactions, filterType, selectedCategory]);

  // ===============================
  // 🔃 SORTING
  // ===============================
  const sortTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === "amount") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [filteredTransactions, sortBy]);

  
  // ===============================
  // 💰 TOTALS
  // ===============================
  const { income, expense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") income += tx.amount;
      if (tx.type === "expense") expense += Math.abs(tx.amount);
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  // ===============================
  // 📆 MONTHLY DATA
  // ===============================
  const monthlyData = useMemo(() => {
    const map = {};

    transactions.forEach((tx) => {
      if (!tx.date) return;

      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      if (!map[key]) {
        map[key] = { income: 0, expense: 0 };
      }

      if (tx.type === "income") map[key].income += tx.amount;
      if (tx.type === "expense")
        map[key].expense += Math.abs(tx.amount);
    });

    return Object.entries(map)
      .map(([month, values]) => ({ month, ...values }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [transactions]);

  // simple analytics: top spending category
  const topSpendingCategory = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        const key = tx.category || "Unknown";
        if (!map[key]) map[key] = 0;
        map[key] += Math.abs(tx.amount);
      }
    });
    const entries = Object.entries(map);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { category: entries[0][0], amount: entries[0][1] };
  }, [transactions]);

  const categoryAI = useMemo(
  () => getCategoryInsights(transactions),
  [transactions]
);

const monthlyAI = useMemo(
  () => getMonthlyInsights(monthlyData),
  [monthlyData]
);

const transactionInsights = useMemo(() => {
  return getTransactionInsights(transactions);
}, [transactions]);

const handleLogout = () => {
  clearToken();
  setUser(null);
  setTransactions([]);
};

  
// ===============================
// ⏳ WAIT UNTIL AUTH RESTORED
// ===============================
if (loading) {
  return null; // or spinner later
}

// ===============================
// 🔑 AUTH GATE
// ===============================
if (!user) {
  return <AuthPage onAuth={setUser} />;
}



 

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col border-r border-gray-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
                ₹
              </div>
              <div>
                <p className="text-sm font-semibold">FinTrack</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Personal finance
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition
                ${
                  activeTab === "dashboard"
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
            >
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition
                ${
                  activeTab === "analytics"
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
            >
              <span className="text-lg">📈</span>
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition
                ${
                  activeTab === "settings"
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
            >
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400">
            <p>Logged in as</p>
            <p className="font-semibold truncate">
              {user?.email || "you@example.com"}
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="w-full px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {activeTab === "dashboard" && "Finance Dashboard"}
                {activeTab === "analytics" && "Analytics"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === "dashboard" &&
                  "Track income, expenses, and insights."}
                {activeTab === "analytics" &&
                  "Deeper look into trends and spending patterns."}
                {activeTab === "settings" &&
                  "Manage your profile, preferences, and security."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              {activeTab !== "settings" && (
                <div className="hidden sm:flex items-center px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs w-56">
                  <span className="mr-2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search category or amount"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent w-full outline-none text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              )}

              <ThemeToggle />

              {/* Profile + dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold">
                    {user?.name ? user.name[0]?.toUpperCase() : "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-semibold text-xs">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Personal
                    </p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg text-xs py-1 z-20">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="font-semibold truncate">
                        {user?.email || "you@example.com"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="w-full px-6 py-6 space-y-6">
            {/* For dashboard and analytics, keep summary cards */}
            {activeTab !== "settings" && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard
                  title="Net Balance"
                  amount={`₹${balance.toFixed(2)}`}
                />
                <BalanceCard
                  title="Income"
                  amount={`₹${income.toFixed(2)}`}
                  theme="green"
                />
                <BalanceCard
                  title="Expenses"
                  amount={`₹${expense.toFixed(2)}`}
                  theme="red"
                />
              </section>
            )}

            {/* TABS CONTENT */}
            {activeTab === "dashboard" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: filters + history */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                    <h3 className="text-sm font-semibold mb-3">
                      Transactions filters
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {/* Type */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Type
                        </span>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="border border-gray-300 bg-white text-gray-800
                                     dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700
                                     rounded-md px-2 py-1 text-xs"
                        >
                          <option value="all">All</option>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Category
                        </span>
                        <select
                          value={selectedCategory}
                          onChange={(e) =>
                            setSelectedCategory(e.target.value)
                          }
                          className="border border-gray-300 bg-white text-gray-800
                                     dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700
                                     rounded-md px-2 py-1 text-xs"
                        >
                          <option value="all">All</option>
                          <option value="salary">Salary</option>
                          <option value="freelance">Freelance</option>
                          <option value="food">Food</option>
                          <option value="rent">Rent</option>
                          <option value="groceries">Groceries</option>
                          <option value="transport">Transport</option>
                        </select>
                      </div>

                      {/* Sort */}
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-gray-500 dark:text-gray-400">
                          Sort
                        </span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="border border-gray-300 bg-white text-gray-800
                                     dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700
                                     rounded-md px-2 py-1 text-xs"
                        >
                          <option value="date">Date (Newest)</option>
                          <option value="amount">Amount (High → Low)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <TransactionList
                    transactions={sortTransactions}
                    fetchTransactions={fetchTransactions}
                  />
                </div>

                {/* Center: Add transaction */}
                <div>
                  <AddTransaction fetchTransactions={fetchTransactions} />
                </div>

                {/* Right: charts */}
                <div className="space-y-6">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold mb-3">
                      Monthly Overview
                    </h2>
                    <MonthlyBarChart monthlyData={monthlyData} />
                  </div>

                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold mb-3">
                      Category Breakdown
                    </h2>
                    <CategoryChart transactions={transactions} />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "analytics" && (
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Charts big */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-semibold">
                        Income vs Expense Over Time
                      </h2>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Based on all transactions
                      </span>
                    </div>
                    <MonthlyBarChart monthlyData={monthlyData} />
                  </div>

                  <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
  <AISummaryCard
    title="Spending trend"
    summary={monthlyAI.trend}
  />

  <AISummaryCard
    title="Top spending category"
    summary={
      categoryAI.topExpenseCategory
        ? `${categoryAI.topExpenseCategory} is your highest expense category.`
        : "No expense data yet."
    }
    secondary={
      categoryAI.amount
        ? `₹${categoryAI.amount.toFixed(2)} spent in this category.`
        : null
    }
  />
</section>


                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-semibold">
                        Spending by Category
                      </h2>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Only expenses
                      </span>
                    </div>
                    <CategoryChart transactions={transactions} />
                  </div>
                </div>

                {/* Side analytics */}
                <div className="space-y-4">
                  {/* Side analytics */}
<div className="space-y-4">

  {/* AI summary – paste here */}
  <section>
   <AISummaryCard
  title="This month at a glance"
  income={transactionInsights.income}
  expense={transactionInsights.expense}
  savings={transactionInsights.savings}
  secondary={`Expenses are ${transactionInsights.expensePercent}% of income.`}
/>


  </section>

  {/* Existing card
  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-sm">
    <h3 className="font-semibold mb-2">Quick stats</h3>
    ...
  </div> */}

  {/* Existing card */}
  {/* <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-sm">
    <h3 className="font-semibold mb-2">Top spending category</h3>
    ...
  </div> */}

</div>

                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-sm">
  <h3 className="font-semibold mb-2">Quick stats</h3>

  <p className="text-gray-600 dark:text-gray-300">
    Total income:{" "}
    <span className="font-semibold text-emerald-500">
      ₹{transactionInsights.income.toFixed(2)}
    </span>
  </p>

  <p className="text-gray-600 dark:text-gray-300">
    Total expense:{" "}
    <span className="font-semibold text-rose-500">
      ₹{transactionInsights.expense.toFixed(2)}
    </span>
  </p>

  <p className="text-gray-600 dark:text-gray-300 mt-1">
    Net savings:{" "}
    <span
      className={
        transactionInsights.savings >= 0
          ? "font-semibold text-emerald-400"
          : "font-semibold text-rose-400"
      }
    >
      ₹{transactionInsights.savings.toFixed(2)}
    </span>
  </p>

  <p className="text-gray-600 dark:text-gray-300 mt-1">
    Expenses are{" "}
    <span className="font-semibold">
      {transactionInsights.expensePercent}%
    </span>{" "}
    of income
  </p>
</div>


                 <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-sm">
  <h3 className="font-semibold mb-2">Top spending category</h3>

  {transactionInsights.topCategory ? (
    <>
      <p className="text-gray-600 dark:text-gray-300">
        Category:{" "}
        <span className="font-semibold">
          {transactionInsights.topCategory}
        </span>
      </p>

      <p className="text-gray-600 dark:text-gray-300">
        Amount:{" "}
        <span className="font-semibold text-rose-500">
          ₹{transactionInsights.topAmount.toFixed(2)}
        </span>
      </p>
    </>
  ) : (
    <p className="text-gray-500 dark:text-gray-400">
      Not enough expense data yet.
    </p>
  )}
</div>

                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400">
                    <p>
                      Use search and filters to explore trends for specific
                      categories or amounts.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <section className="max-w-xl space-y-6">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-semibold mb-3">
                    Profile settings
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || ""}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm outline-none"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || "you@example.com"}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm outline-none"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      In a real app, this page would let you update your
                      profile and sync with backend.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-semibold mb-3">
                    Password & security
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300 mb-1">
                        Change password
                      </label>
                      <input
                        type="password"
                        placeholder="New password (demo only)"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm outline-none"
                      />
                    </div>
                    <button className="px-3 py-2 rounded-md bg-slate-900 text-white text-xs dark:bg-slate-100 dark:text-slate-900">
                      Save (disabled in demo)
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This is a static UI. For production, hook this to an API
                      endpoint that updates the password with hashing.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 text-sm">
                  <h2 className="text-lg font-semibold mb-3">
                    Theme preference
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Use the toggle in the top bar to switch between light and
                    dark theme.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    In a full app, theme choice would be stored per user and
                    synced across devices.
                  </p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

