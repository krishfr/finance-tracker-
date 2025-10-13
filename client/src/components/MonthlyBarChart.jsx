import { Bar } from 'react-chartjs-2';

// 🛑 The registration block has been removed from here.

const MonthlyBarChart = ({ monthlyData }) => {
  if (!monthlyData || !Array.isArray(monthlyData)) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">Loading monthly data...</div>;
  }

  // NOTE: This data preparation logic is fine, but for performance, should be moved to useMemo in App.js.
  const labels = monthlyData.map((item) => item.month);
  const incomeData = monthlyData.map((item) => item.income);
  const expenseData = monthlyData.map((item) => item.expense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#4caf50',
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: '#f44336',
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 400,
    },
    hover: {
      mode: 'index',
      intersect: false,
      animationDuration: 200,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">📊 Monthly Income vs Expense</h2>
      <div className="h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyBarChart;