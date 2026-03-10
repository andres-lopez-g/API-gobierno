export default function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-6 transition-colors hover:border-surface-700">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600/10">
            <Icon className="h-5 w-5 text-primary-400" />
          </div>
        )}
        <div>
          <p className="text-sm text-surface-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-surface-500">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
