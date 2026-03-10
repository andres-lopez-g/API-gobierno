import { ExternalLink, BookOpen, Code, Server } from 'lucide-react';

const endpoints = [
  {
    method: 'GET',
    path: '/precipitaciones',
    desc: 'Consultar registros de precipitaciones con filtros opcionales y paginación.',
    params: [
      { name: 'departamento', type: 'string', desc: 'Filtrar por departamento (coincidencia parcial)' },
      { name: 'municipio', type: 'string', desc: 'Filtrar por municipio (coincidencia parcial)' },
      { name: 'fecha_inicio', type: 'date', desc: 'Fecha mínima (YYYY-MM-DD)' },
      { name: 'fecha_fin', type: 'date', desc: 'Fecha máxima (YYYY-MM-DD)' },
      { name: 'limit', type: 'int', desc: 'Máximo de registros (1–1000, default: 100)' },
      { name: 'offset', type: 'int', desc: 'Desplazamiento para paginación (default: 0)' },
    ],
  },
  {
    method: 'GET',
    path: '/precipitaciones/{id}',
    desc: 'Retorna un único registro de precipitación por su ID.',
    params: [{ name: 'id', type: 'int', desc: 'ID del registro (path param)' }],
  },
  {
    method: 'GET',
    path: '/estadisticas',
    desc: 'Estadísticas agregadas (count, avg, max, min) por departamento.',
    params: [],
  },
  {
    method: 'GET',
    path: '/departamentos',
    desc: 'Lista ordenada de todos los departamentos distintos.',
    params: [],
  },
  {
    method: 'GET',
    path: '/health',
    desc: 'Verificación del estado de la API.',
    params: [],
  },
];

export default function Docs() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Documentación</h1>
          <p className="mt-2 text-surface-400">
            Referencia rápida de los endpoints de la API de Precipitaciones.
          </p>
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary-400 no-underline hover:text-primary-300"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir Swagger UI completo
          </a>
        </div>

        {/* Info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
            <Server className="mb-3 h-5 w-5 text-primary-400" />
            <h3 className="font-medium text-white">Base URL</h3>
            <code className="mt-1 block text-sm text-surface-400">http://localhost:5000</code>
          </div>
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
            <Code className="mb-3 h-5 w-5 text-primary-400" />
            <h3 className="font-medium text-white">Formato</h3>
            <p className="mt-1 text-sm text-surface-400">JSON (application/json)</p>
          </div>
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
            <BookOpen className="mb-3 h-5 w-5 text-primary-400" />
            <h3 className="font-medium text-white">Fuente</h3>
            <p className="mt-1 text-sm text-surface-400">datos.gov.co (ksew-j3zj)</p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="rounded-xl border border-surface-800 bg-surface-900/50 p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-primary-600/15 px-2.5 py-1 text-xs font-bold text-primary-300">
                  {ep.method}
                </span>
                <code className="text-sm font-medium text-white">{ep.path}</code>
              </div>
              <p className="mt-3 text-sm text-surface-400">{ep.desc}</p>

              {ep.params.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-surface-800 text-surface-500">
                        <th className="py-2 pr-4 font-medium">Parámetro</th>
                        <th className="py-2 pr-4 font-medium">Tipo</th>
                        <th className="py-2 font-medium">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((p) => (
                        <tr key={p.name} className="border-b border-surface-800/50">
                          <td className="py-2 pr-4">
                            <code className="text-primary-400">{p.name}</code>
                          </td>
                          <td className="py-2 pr-4 text-surface-500">{p.type}</td>
                          <td className="py-2 text-surface-400">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
