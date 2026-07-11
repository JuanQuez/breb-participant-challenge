import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Bre-B Participant Challenge</h1>
        <p className="mt-2 text-ink/60">
          Integración de recaudos y transferencias salientes contra el sandbox de Bre-B
          Participant.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/collections"
          className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition hover:border-brand-pink/40"
        >
          <p className="font-medium text-ink">Recaudos</p>
          <p className="mt-1 text-sm text-ink/60">Crear, consultar y listar recaudos.</p>
        </Link>
        <Link
          href="/transfers"
          className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition hover:border-brand-pink/40"
        >
          <p className="font-medium text-ink">Transferencias</p>
          <p className="mt-1 text-sm text-ink/60">Resolver llave y enviar dinero.</p>
        </Link>
      </div>
    </main>
  );
}
