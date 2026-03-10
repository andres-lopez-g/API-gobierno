export default function Loader({ text = 'Cargando datos…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-primary-500" />
      <p className="mt-4 text-sm text-surface-400">{text}</p>
    </div>
  );
}
