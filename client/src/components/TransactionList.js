// 
import axios from 'axios';

export default function TransactionList({ transactions, fetchTransactions }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
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

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">📋 Transaction History</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">{transaction.category}</p>
              <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
            </div>
            <p className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+₹' : '-₹'}
              {Math.abs(transaction.amount).toFixed(2)}
            </p>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="text-red-500 hover:text-red-700 text-xl ml-4"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

