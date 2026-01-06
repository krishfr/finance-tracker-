// src/components/BalanceCard.jsx
function BalanceCard({ title, amount, theme }) {
  const tone =
    theme === "green" ? "green" : theme === "red" ? "red" : "sky";

  const cardGradients = {
    sky: "from-sky-500/10 to-sky-500/0 border-slate-200 dark:border-slate-700",
    green:
      "from-emerald-500/10 to-emerald-500/0 border-emerald-200 dark:border-emerald-700",
    red: "from-rose-500/10 to-rose-500/0 border-rose-200 dark:border-rose-700",
  };

  const pillColors = {
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    red: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  };

  const amountColors = {
    sky: "text-slate-900 dark:text-slate-50",
    green: "text-emerald-600 dark:text-emerald-300",
    red: "text-rose-600 dark:text-rose-300",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur 
      ${cardGradients[tone]}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
            {title}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${pillColors[tone]}`}
          >
            This month
          </span>
        </div>

        <p
          className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${amountColors[tone]}`}
        >
          {amount}
        </p>

        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Updated in real time</span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.25)]" />
            Live
          </span>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
