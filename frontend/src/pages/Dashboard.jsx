import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Droplets, MapPin } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getEstadisticas, getDepartamentos } from '../services/api';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const CHART_COLORS = [
  '#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8',
  '#bfdbfe', '#1e40af', '#dbeafe', '#1e3a8a', '#eff6ff',
  '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985',
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [deptos, setDeptos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getEstadisticas(), getDepartamentos()])
      .then(([statsRes, deptosRes]) => {
        if (cancelled) return;
        setStats(statsRes);
        setDeptos(deptosRes);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="pt-24"><Loader text="Cargando estadísticas…" /></div>;
  if (error) return <div className="pt-24 px-4"><ErrorMessage message={error} /></div>;

  const data = stats?.data || [];
  const totalRegistros = data.reduce((s, d) => s + d.total_registros, 0);
  const promedioGlobal = data.length
    ? (data.reduce((s, d) => s + (d.promedio_mm || 0), 0) / data.length).toFixed(1)
    : '—';
  const maxDepto = data.reduce((m, d) => ((d.max_mm || 0) > (m.max_mm || 0) ? d : m), data[0] || {});
  const totalDeptos = deptos?.departamentos?.length || data.length;

  // Charts data
  const barData = [...data]
    .sort((a, b) => (b.promedio_mm || 0) - (a.promedio_mm || 0))
    .slice(0, 15)
    .map((d) => ({
      name: d.departamento || 'Sin dato',
      promedio: Number((d.promedio_mm || 0).toFixed(1)),
      max: Number((d.max_mm || 0).toFixed(1)),
    }));

  const pieData = [...data]
    .sort((a, b) => b.total_registros - a.total_registros)
    .slice(0, 8)
    .map((d) => ({
      name: d.departamento || 'Sin dato',
      value: d.total_registros,
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border border-surface-700 bg-surface-800 px-4 py-3 shadow-xl">
        <p className="mb-1 text-sm font-medium text-white">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-xs text-surface-300">
            {p.dataKey === 'promedio' ? 'Promedio' : 'Máximo'}: {p.value} mm
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-surface-400">
            Estadísticas agregadas de precipitaciones por departamento.
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Droplets} label="Total registros" value={totalRegistros.toLocaleString()} />
          <StatCard icon={BarChart3} label="Promedio general" value={`${promedioGlobal} mm`} />
          <StatCard
            icon={TrendingUp}
            label="Máximo registrado"
            value={`${(maxDepto.max_mm || 0).toFixed(1)} mm`}
            sub={maxDepto.departamento}
          />
          <StatCard icon={MapPin} label="Departamentos" value={totalDeptos} />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bar chart */}
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-6 lg:col-span-2">
            <h3 className="mb-6 text-lg font-semibold text-white">
              Precipitación promedio por departamento (Top 15)
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="promedio" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Promedio (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-6">
            <h3 className="mb-6 text-lg font-semibold text-white">Registros por departamento</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    stroke="#0f172a"
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                    formatter={(value) => <span className="text-surface-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">Resumen por departamento</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-800 text-surface-400">
                  <th className="px-4 py-3 font-medium">Departamento</th>
                  <th className="px-4 py-3 font-medium text-right">Registros</th>
                  <th className="px-4 py-3 font-medium text-right">Promedio (mm)</th>
                  <th className="px-4 py-3 font-medium text-right">Máx (mm)</th>
                  <th className="px-4 py-3 font-medium text-right">Mín (mm)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-surface-800/50 transition-colors hover:bg-surface-800/30"
                  >
                    <td className="px-4 py-3 font-medium text-white">{d.departamento || '—'}</td>
                    <td className="px-4 py-3 text-right text-surface-300">{d.total_registros}</td>
                    <td className="px-4 py-3 text-right text-surface-300">
                      {d.promedio_mm != null ? d.promedio_mm.toFixed(1) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-primary-400">
                      {d.max_mm != null ? d.max_mm.toFixed(1) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-surface-300">
                      {d.min_mm != null ? d.min_mm.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
