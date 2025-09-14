import React, { useState } from 'react';
import axios from 'axios';

const AddTransaction = ({ fetchTransactions }) => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = type === 'expense' ? -Math.abs(Number(amount)) : Number(amount);
    try {
      await axios.post('http://localhost:5000/api/transactions', { type, amount: numericAmount, category });
      alert('Transaction added successfully!');
      setAmount('');
      setCategory('Salary');
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded shadow">
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 mb-8">
      <h2 className="text-2xl font-bold text-gray-700">➕ Add Transaction</h2>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Groceries">Groceries</option>
          <option value="Transport">Transport</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded">
        Add Transaction
      </button>
    </form>
    </div>
  );
};

export default AddTransaction;
