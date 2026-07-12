import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-surface to-surface2 px-6 py-12 sm:px-10 sm:py-16">
        <Image
          src="/svg/favicon.svg"
          alt=""
          width={420}
          height={420}
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 opacity-[0.07] sm:-right-8 sm:-top-24"
        />
        <div className="relative">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Bre-B With Mono</h1>
          <p className="mt-2 max-w-md text-ink/60">
            Integración de recaudos y transferencias.
          </p>
        </div>
      </section>
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
