export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        This module is registered in the first architecture pass and will be connected to secured backend workflows in the next implementation phases.
      </p>
    </div>
  );
}
