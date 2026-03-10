import { Link } from 'react-router-dom';
import { CloudRain, Database, BarChart3, Search, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Datos Abiertos',
    desc: 'Accede a registros de precipitaciones del portal datos.gov.co del gobierno colombiano.',
  },
  {
    icon: Zap,
    title: 'API REST Rápida',
    desc: 'Endpoints optimizados con FastAPI, filtros flexibles y paginación integrada.',
  },
  {
    icon: BarChart3,
    title: 'Estadísticas en Tiempo Real',
    desc: 'Visualiza promedios, máximos y mínimos por departamento con gráficas interactivas.',
  },
  {
    icon: Search,
    title: 'Explorador de Datos',
    desc: 'Busca y filtra registros por departamento, municipio y rango de fechas.',
  },
  {
    icon: Shield,
    title: 'Datos Confiables',
    desc: 'Información verificada proveniente del portal oficial de datos del gobierno.',
  },
  {
    icon: Globe,
    title: 'Cobertura Nacional',
    desc: 'Estaciones de medición en múltiples departamentos y municipios de Colombia.',
  },
];

const codeExample = `// Consultar precipitaciones por departamento
const response = await fetch(
  '/precipitaciones?departamento=antioquia&limit=10'
);
const { data, total } = await response.json();

// Obtener estadísticas agregadas
const stats = await fetch('/estadisticas');
const { data: departamentos } = await stats.json();`;

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary-600/8 blur-3xl" />
          <div className="absolute top-40 right-0 h-[400px] w-[600px] rounded-full bg-primary-400/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300">
              <CloudRain className="h-4 w-4" />
              Datos Abiertos de Colombia
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              API de{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                Precipitaciones
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-400 sm:text-xl">
              Consulta, filtra y visualiza datos de precipitaciones del portal de datos abiertos del
              gobierno colombiano. API REST con FastAPI, paginación y estadísticas.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white no-underline shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Ver Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/explorador"
                className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-900/50 px-6 py-3 font-medium text-surface-300 no-underline transition-colors hover:border-surface-600 hover:text-white"
              >
                Explorar Datos
              </Link>
            </div>
          </div>

          {/* Code preview */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-surface-800 bg-surface-900/80 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-surface-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-surface-700" />
                <div className="h-3 w-3 rounded-full bg-surface-700" />
                <div className="h-3 w-3 rounded-full bg-surface-700" />
                <span className="ml-2 text-xs text-surface-500">ejemplo.js</span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-surface-300">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-surface-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Todo lo que necesitas para trabajar con datos de precipitaciones
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Una API completa con filtros, paginación, estadísticas y visualización de datos.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-surface-800 bg-surface-900/30 p-6 transition-all hover:border-primary-500/30 hover:bg-surface-900/60"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-600/10 transition-colors group-hover:bg-primary-600/20">
                  <f.icon className="h-5 w-5 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints section */}
      <section className="border-t border-surface-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Endpoints disponibles</h2>
            <p className="mt-4 text-lg text-surface-400">
              API REST estándar con respuestas JSON limpias y documentación Swagger integrada.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {[
              { method: 'GET', path: '/precipitaciones', desc: 'Consultar registros con filtros y paginación' },
              { method: 'GET', path: '/precipitaciones/{id}', desc: 'Obtener un registro por ID' },
              { method: 'GET', path: '/estadisticas', desc: 'Estadísticas agregadas por departamento' },
              { method: 'GET', path: '/departamentos', desc: 'Lista de todos los departamentos' },
              { method: 'GET', path: '/health', desc: 'Estado de la API' },
            ].map((ep) => (
              <div
                key={ep.path}
                className="flex flex-col gap-2 rounded-xl border border-surface-800 bg-surface-900/40 p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="inline-flex w-fit rounded-md bg-primary-600/15 px-2.5 py-1 text-xs font-bold text-primary-300">
                  {ep.method}
                </span>
                <code className="text-sm font-medium text-white">{ep.path}</code>
                <span className="text-sm text-surface-400 sm:ml-auto">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-surface-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Comienza a explorar los datos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-surface-400">
            Visualiza estadísticas, filtra registros y descubre patrones en los datos de precipitaciones de Colombia.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white no-underline shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
            >
              Ir al Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-700 px-6 py-3 font-medium text-surface-300 no-underline transition-colors hover:border-surface-600 hover:text-white"
            >
              Documentación Swagger
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
