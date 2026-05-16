import { useStats } from '../../hooks/useStats';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Contacted: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  Qualified: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  Lost: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
};

export function StatsCards() {
  const { stats, isLoading } = useStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const totalCard = (
    <div key="total" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{stats.total}</p>
    </div>
  );

  const statusCards = Object.entries(stats.byStatus).map(([status, count]) => (
    <div key={status} className={`rounded-xl border p-4 flex flex-col gap-1 ${STATUS_COLORS[status] ?? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{status}</p>
      <p className="text-2xl font-bold font-mono">{count}</p>
    </div>
  ));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {totalCard}
      {statusCards}
    </div>
  );
}
