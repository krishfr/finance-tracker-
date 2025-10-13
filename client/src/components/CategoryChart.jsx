import React from "react";
import { Bar } from "react-chartjs-2";
// 🛑 The registration block has been removed from here.

const CategoryChart = ({ transactions }) => {
  // Group data by category
  const categoryMap = {};

  transactions.forEach((tx) => {
    const category = tx.category;
    if (!categoryMap[category]) {
      categoryMap[category] = { income: 0, expense: 0 };
    }
    if (tx.type === "income") {
      categoryMap[category].income += tx.amount;
    } else if (tx.type === "expense") {
      categoryMap[category].expense += Math.abs(tx.amount);
    }
  });

  const categories = Object.keys(categoryMap);
  const incomeData = categories.map((cat) => categoryMap[cat].income);
  const expenseData = categories.map((cat) => categoryMap[cat].expense);

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Category-wise Income vs Expense" },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default CategoryChart;