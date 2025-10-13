import AddTransaction from './components/AddTransaction';
import BalanceCard from "./components/BalanceCard";
import TransactionList from './components/TransactionList';
import MonthlyBarChart from './components/MonthlyBarChart';
import ThemeToggle from './components/ThemeToggle';
import CategoryChart from './components/CategoryChart';
import axios from 'axios';
import { useState, useEffect, useMemo, useCallback } from 'react'; 

// Define API_URL outside the component for clean execution
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- Data Fetching ---
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/transactions`);
      const data = res.data.map(tx => ({
        id: tx.id || tx._id, // CRITICAL: Normalize ID
        ...tx,
        amount: Number(tx.amount)
      }));
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // --- Memoized Calculations (Performance) ---

  // 1. Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const type = txn.type ? txn.type.toLowerCase() : '';
      const category = txn.category ? txn.category.toLowerCase() : '';

      const matchesType = filterType === 'all' || type === filterType;
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
      
      return matchesType && matchesCategory;
    });
  }, [transactions, filterType, selectedCategory]);

  // 2. Sorting Logic
  const sortTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === "amount") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  }, [filteredTransactions, sortBy]);

  // 3. Aggregation Logic
  const { income, expense, balance } = useMemo(() => {
    const amounts = transactions.map(tx => tx.amount);
    const income = amounts.filter(a => a > 0).reduce((acc, a) => acc + a, 0);
    const expense = amounts.filter(a => a < 0).reduce((acc, a) => acc + a, 0) * -1;
    const balance = income - expense;
    return { income, expense, balance };
  }, [transactions]);
  
  // 4. Monthly Data Logic
  const monthlyData = useMemo(() => {
    const monthlyMap = {};

    transactions.forEach((tx) => {
      if (!tx.date || isNaN(new Date(tx.date))) return; 
      
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        monthlyMap[key].income += tx.amount;
      } else if (tx.type === 'expense') {
        // Use Math.abs here for chart consistency
        monthlyMap[key].expense += Math.abs(tx.amount); 
      }
    });

    return Object.entries(monthlyMap)
      .map(([month, { income, expense }]) => ({
        month,
        income,
        expense
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [transactions]);


  // --- Render ---

  return (
    // Updated background and font family
 <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300"> 
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header and ThemeToggle */}
        <header className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-gray-700 mb-6">
            <h1 className='text-4xl font-extrabold text-sky-600 dark:text-sky-400'>
                💰 Finance Dashboard
            </h1>
            <ThemeToggle />
        </header>

        {/* Balance Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <BalanceCard title="Net Balance" amount={`₹${balance.toFixed(2)}`} />
          <BalanceCard title="Income" amount={`₹${income.toFixed(2)}`} theme="green" />
          <BalanceCard title="Expenses" amount={`₹${expense.toFixed(2)}`} theme="red" />
        </section>

        {/* Main Content: Add Transaction (1/3) and List/Filters (2/3) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Add Transaction Form (Placeholder for complexity) */}
          <div className="lg:col-span-1">
            <AddTransaction fetchTransactions={fetchTransactions} />
          </div>

          {/* Transaction List and Filters Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Refined Filters Block */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3 border-b pb-2 dark:border-gray-700">Filter & Sort</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                    
                    {/* Filter by Type */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="filter" className="text-sm font-medium">Type:</label>
                        <select
                            id="filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    {/* Filter by Category */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="category" className="text-sm font-medium">Category:</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
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

                    {/* Sort by */}
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <label htmlFor="sort" className="text-sm font-medium">Sort:</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
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
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow mb-6 dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-700 mb-4 dark:text-gray-300">Monthly Overview</h2>
                <div className="min-h-[300px]"> 
                    <MonthlyBarChart monthlyData={monthlyData} />
            </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow mb-6 dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-700 mb-4 dark:text-gray-300">Category Breakdown</h2>
                  <div className="min-h-[300px]">
                    <CategoryChart transactions={transactions} />
            </div>
            </div>
        </section>
      </div>
    </div>
  );
}

export default App;