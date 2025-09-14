import AddTransaction from './components/AddTransaction';
import BalanceCard from "./components/BalanceCard";
import TransactionList from './components/TransactionList';
import MonthlyBarChart from './components/MonthlyBarChart';
import ThemeToggle from './components/ThemeToggle';
import CategoryChart from './components/CategoryChart';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      const data = res.data.map(tx => ({
        ...tx,
        amount: Number(tx.amount)
      }));
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
  const matchesType = filterType === 'all' || txn.type.toLowerCase() === filterType;
  const matchesCategory = selectedCategory === 'all' || txn.category.toLowerCase() === selectedCategory;
  return matchesType && matchesCategory;
});


  const sortTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount") {
      return Math.abs(b.amount) - Math.abs(a.amount);
    }
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

  const amounts = transactions.map(tx => tx.amount);
  const income = amounts.filter(a => a > 0).reduce((acc, a) => acc + a, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, a) => acc + a, 0) * -1;
  const balance = income - expense;

  const getMonthlyData = (transactions) => {
    const monthlyMap = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        monthlyMap[key].income += tx.amount;
      } else if (tx.type === 'expense') {
        monthlyMap[key].expense += tx.amount;
      }
    });

    return Object.entries(monthlyMap)
      .map(([month, { income, expense }]) => ({
        month,
        income,
        expense
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const monthlyData = getMonthlyData(transactions);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <ThemeToggle />

      <div className="container mx-auto p-4">
        <h1 className='text-3xl font-bold text-blue-600 mb-4 dark:text-blue-300'>
          💰 Finance Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <BalanceCard title="Balance" amount={`₹${balance}`} />
          <BalanceCard title="Income" amount={`₹${income}`} theme="green" />
          <BalanceCard title="Expenses" amount={`₹${expense}`} theme="red" />
        </div>

        <AddTransaction fetchTransactions={fetchTransactions} />

        <div className="my-4">
          <label htmlFor="filter">Filter: </label>
          <select
            id="filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-2 py-1 ml-2"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="my-4">
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1 ml-2"
          >
            <option value="date">Date (Newest First)</option>
            <option value="amount">Amount (High to Low)</option>
          </select>
        </div>

<div style={{ margin: '1rem 0' }}>
  <label htmlFor="category">Category: </label>
  <select
    id="category"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
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

        <TransactionList
          transactions={sortTransactions}
          fetchTransactions={fetchTransactions}
        />

        <MonthlyBarChart monthlyData={monthlyData} />

        
        <CategoryChart transactions={transactions} />
      </div>
    </div>
  );
}

export default App;
