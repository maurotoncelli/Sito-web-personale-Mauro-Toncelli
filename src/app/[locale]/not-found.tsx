import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-32 text-center">
      <p className="text-6xl font-extrabold text-muted/40">404</p>
      <h1 className="mt-4 text-2xl">Pagina non trovata / Page not found</h1>
      <Link
        href="/it"
        className="mt-8 border border-foreground px-8 py-3 text-[13px] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
      >
        Home
      </Link>
    </div>
  );
}
