import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarChart = ({ monthlyData }) => {
  if (!monthlyData || !Array.isArray(monthlyData)) {
    return <div>Loading monthly data...</div>;
  }

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
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Monthly Income vs Expense</h2>
      <div className="h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
    </div>
  );
};

export default MonthlyBarChart;
