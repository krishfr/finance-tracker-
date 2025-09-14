export default function BalanceCard({ title, amount, theme = 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded shadow">
    <div className={`rounded-xl p-6 shadow-md ${colors[theme] || 'bg-white text-black'}`}>
      <h3 className="text-sm uppercase tracking-wide text-gray-500">{title}</h3>
      <p className="text-3xl font-extrabold mt-2">{amount}</p>
    </div>
    </div>
  );
}
