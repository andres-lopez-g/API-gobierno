import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getPrecipitaciones, getDepartamentos } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function Explorer() {
  const [records, setRecords] = useState(null);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    departamento: '',
    municipio: '',
    fecha_inicio: '',
    fecha_fin: '',
    limit: 25,
    offset: 0,
  });

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const [data, deptosRes] = await Promise.all([
        getPrecipitaciones(params),
        deptos.length ? Promise.resolve({ departamentos: deptos }) : getDepartamentos(),
      ]);
      setRecords(data);
      if (!deptos.length) setDeptos(deptosRes.departamentos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [deptos.length]);

  useEffect(() => {
    fetchData(filters);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, offset: 0 };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleClear = () => {
    const cleared = { departamento: '', municipio: '', fecha_inicio: '', fecha_fin: '', limit: 25, offset: 0 };
    setFilters(cleared);
    fetchData(cleared);
  };

  const goToPage = (newOffset) => {
    const updated = { ...filters, offset: newOffset };
    setFilters(updated);
    fetchData(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = records ? Math.ceil(records.total / filters.limit) : 0;

  const hasActiveFilters = filters.departamento || filters.municipio || filters.fecha_inicio || filters.fecha_fin;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Explorador de Datos</h1>
            <p className="mt-2 text-surface-400">
              Busca y filtra registros de precipitaciones.
              {records && (
                <span className="ml-1 text-primary-400">
                  {records.total.toLocaleString()} registros encontrados
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-900/50 px-4 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white sm:self-auto"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <form
            onSubmit={handleSearch}
            className="mb-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Departamento */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-400">Departamento</label>
                <select
                  value={filters.departamento}
                  onChange={(e) => setFilters({ ...filters, departamento: e.target.value })}
                  className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  {deptos.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Municipio */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-400">Municipio</label>
                <input
                  type="text"
                  value={filters.municipio}
                  onChange={(e) => setFilters({ ...filters, municipio: e.target.value })}
                  placeholder="Buscar municipio…"
                  className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-400">Fecha desde</label>
                <input
                  type="date"
                  value={filters.fecha_inicio}
                  onChange={(e) => setFilters({ ...filters, fecha_inicio: e.target.value })}
                  className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Fecha fin */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-400">Fecha hasta</label>
                <input
                  type="date"
                  value={filters.fecha_fin}
                  onChange={(e) => setFilters({ ...filters, fecha_fin: e.target.value })}
                  className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500"
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 rounded-lg border border-surface-700 px-4 py-2.5 text-sm font-medium text-surface-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Limpiar
                </button>
              )}
            </div>
          </form>
        )}

        {/* Content */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-surface-800 bg-surface-900/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-800 bg-surface-900/80">
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400">ID</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400">Estación</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400">Departamento</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400">Municipio</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400">Fecha</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400 text-right">
                        Valor (mm)
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400 text-right">
                        Latitud
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium text-surface-400 text-right">
                        Longitud
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.data.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-surface-500">
                          No se encontraron registros con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      records.data.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-surface-800/50 transition-colors hover:bg-surface-800/30"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-surface-500">{r.id}</td>
                          <td className="max-w-[200px] truncate px-4 py-3 text-white" title={r.nombre_estacion}>
                            {r.nombre_estacion || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-surface-300">{r.departamento || '—'}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-surface-300">{r.municipio || '—'}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-surface-300">
                            {r.fecha ? r.fecha.split('T')[0] : '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-primary-400">
                            {r.valor_mm != null ? r.valor_mm : '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-surface-400">
                            {r.latitud != null ? Number(r.latitud).toFixed(4) : '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-surface-400">
                            {r.longitud != null ? Number(r.longitud).toFixed(4) : '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-surface-500">
                  Mostrando {filters.offset + 1}–{Math.min(filters.offset + filters.limit, records.total)}{' '}
                  de {records.total.toLocaleString()} registros
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(Math.max(0, filters.offset - filters.limit))}
                    disabled={filters.offset === 0}
                    className="inline-flex items-center gap-1 rounded-lg border border-surface-700 px-3 py-2 text-sm text-surface-400 transition-colors hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <span className="px-3 text-sm text-surface-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(filters.offset + filters.limit)}
                    disabled={filters.offset + filters.limit >= records.total}
                    className="inline-flex items-center gap-1 rounded-lg border border-surface-700 px-3 py-2 text-sm text-surface-400 transition-colors hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
