export function getTransactionInsights(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let income = 0;
  let expense = 0;
  const categoryExpenseMap = {};

  transactions.forEach((tx) => {
    if (!tx.date) return;

    const txDate = new Date(tx.date);

    if (
      txDate.getMonth() === currentMonth &&
      txDate.getFullYear() === currentYear
    ) {
      if (tx.type === "income") {
        income += tx.amount;
      }

      if (tx.type === "expense") {
        const amt = Math.abs(tx.amount);
        expense += amt;

        categoryExpenseMap[tx.category] =
          (categoryExpenseMap[tx.category] || 0) + amt;
      }
    }
  });

  let topCategory = null;
  let topAmount = 0;

  Object.entries(categoryExpenseMap).forEach(([category, amount]) => {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = category;
    }
  });

  const savings = income - expense;
  const expensePercent =
    income > 0 ? Number(((expense / income) * 100).toFixed(1)) : 0;

  return {
    income,
    expense,
    savings,
    expensePercent,
    topCategory,
    topAmount,
  };
}
