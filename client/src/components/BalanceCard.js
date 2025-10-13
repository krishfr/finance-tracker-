export default function BalanceCard({ title, amount, theme = 'blue' }) {
  const colors = {
    // Enhanced colors for better dark mode contrast and professionalism
    blue: 'bg-sky-50 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    red: 'bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  };

  return (
    // Applied strong shadow to the container for depth
    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl transition-shadow duration-300">
        <div className={`rounded-lg p-6 ${colors[theme] || colors.blue}`}>
          <h3 className="text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">{title}</h3>
          <p className="text-4xl font-extrabold mt-2">{amount}</p>
        </div>
    </div>
  );
}