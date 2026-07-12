import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-ink/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/svg/mono.svg" alt="Mono" width={72} height={19} priority />
          <span className="h-4 w-px bg-ink/15" aria-hidden />
          <Image src="/svg/logo-bre-b.svg" alt="Bre-B" width={63} height={20} priority />
        </Link>
      </div>
    </header>
  );
}
