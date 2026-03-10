export default function ErrorMessage({ message }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <p className="text-sm text-red-400">{message}</p>
      <p className="mt-2 text-xs text-surface-500">
        Verifica que la API esté corriendo en el puerto 5000.
      </p>
    </div>
  );
}
