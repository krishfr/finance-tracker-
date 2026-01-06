// src/ai/monthlyInsights.js

export function getMonthlyInsights(monthlyData) {
  if (!monthlyData || monthlyData.length === 0) {
    return {
      summary: "No monthly data available yet.",
      trend: null,
    };
  }

  const current = monthlyData[monthlyData.length - 1];
  const previous = monthlyData[monthlyData.length - 2];

  let trendText = "No previous month data to compare.";

  if (previous) {
    const expenseDiff = current.expense - previous.expense;
    const percent =
      previous.expense > 0
        ? Math.round((expenseDiff / previous.expense) * 100)
        : 0;

    if (expenseDiff > 0) {
      trendText = `Your expenses increased by ${percent}% compared to last month.`;
    } else if (expenseDiff < 0) {
      trendText = `Your expenses decreased by ${Math.abs(percent)}% compared to last month.`;
    } else {
      trendText = "Your expenses stayed the same as last month.";
    }
  }

  const summary = `
This month you earned ₹${current.income.toFixed(2)} and spent ₹${current.expense.toFixed(2)}.
Your net savings are ₹${(current.income - current.expense).toFixed(2)}.
`.trim();

  return {
    summary,
    trend: trendText,
    month: current.month,
  };
}
