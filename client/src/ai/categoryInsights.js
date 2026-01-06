// src/ai/categoryInsights.js

export function getCategoryInsights(transactions) {
  const map = {};

  transactions.forEach((tx) => {
    if (!map[tx.category]) {
      map[tx.category] = { income: 0, expense: 0 };
    }

    if (tx.type === "income") {
      map[tx.category].income += tx.amount;
    } else if (tx.type === "expense") {
      map[tx.category].expense += Math.abs(tx.amount);
    }
  });

  const categories = Object.entries(map);

  if (categories.length === 0) {
    return {
      topExpenseCategory: null,
      summary: "No transactions available yet.",
    };
  }

  categories.sort((a, b) => b[1].expense - a[1].expense);

  const [topCategory, topData] = categories[0];

  const totalExpense = categories.reduce(
    (sum, [, val]) => sum + val.expense,
    0
  );

  const percentage =
    totalExpense > 0
      ? Math.round((topData.expense / totalExpense) * 100)
      : 0;

  return {
    topExpenseCategory: topCategory,
    amount: topData.expense,
    percentage,
    summary: `Most of your spending is on ${topCategory}. It accounts for ${percentage}% of total expenses.`,
  };
}

