import axios from 'axios';
import React from 'react'; // Added explicit React import for standard practice

// Define API_URL here once, outside the function.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function TransactionList({ transactions, fetchTransactions }) {
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure want to delete this transaction?')) {
      try {
        await axios.delete(`${API_URL}/api/transactions/${id}`);
        // Refreshes the transactions list in the parent component
        await fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Display a message if the filtered list is empty
  if (!transactions || transactions.length === 0) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 dark:text-gray-300">📋 Transaction History</h2>
            <p className="text-gray-500 italic dark:text-gray-400">
                No transactions found for the current filter/sort settings.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl mb-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 dark:text-gray-300 border-b pb-3">📋 Transaction History</h2>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {transactions.map((transaction) => {
          const isIncome = transaction.amount > 0;
          const amountClass = isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
          const iconClass = isIncome ? 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900' : 'text-rose-500 bg-rose-100 dark:bg-rose-900';
          
          // Contextual Icon Logic
          const iconSvg = isIncome ? (
              // Arrow Up Icon for Income
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a.5.5 0 01-.354-.854L13.293 13H5.5a.5.5 0 010-1h7.793l-3.647-3.646a.5.5 0 01.708-.708l4.5 4.5a.5.5 0 010 .708l-4.5 4.5A.5.5 0 0110 18z" clipRule="evenodd" /></svg>
          ) : (
              // Arrow Down Icon for Expense
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a.5.5 0 00-.354.146L5.5 5.793V13.5a.5.5 0 001 0V5.793l3.646 3.647a.5.5 0 00.708-.708l-4.5-4.5a.5.5 0 00-.708 0l-4.5 4.5a.5.5 0 00.708.708L9.5 5.793v7.707a.5.5 0 001 0V5.793l3.646 3.647a.5.5 0 00.708-.708l-4.5-4.5a.5.5 0 00-.708 0l-2-2A.5.5 0 0010 2z" clipRule="evenodd" /></svg>
          );


          return (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 border-l-4 border-r-4 border-opacity-75 rounded-lg shadow-sm transition-all duration-200 
                         dark:bg-gray-700 dark:border-gray-600"
              style={{ borderColor: isIncome ? '#34d399' : '#fb7185' }} // Tailwind emerald-400 or rose-400
            >
              
              {/* Left Side: Icon, Category, Date */}
              <div className="flex items-center space-x-4 min-w-0">
                  <span className={`p-2 rounded-full ${iconClass}`}>
                      {iconSvg}
                  </span>
                  
                  <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{transaction.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
              </div>

              {/* Right Side: Amount and Delete Button */}
              <div className="flex items-center space-x-4">
                  <p className={`text-lg font-bold ${amountClass} min-w-[100px] text-right`}>
                      {isIncome ? '+₹' : '-₹'}
                      {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                    aria-label="Delete transaction"
                  >
                    {/* Delete Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}