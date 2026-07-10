import { notFound } from "next/navigation";

/** Cattura i percorsi sconosciuti dentro una lingua valida → 404 brandizzata. */
export default function CatchAll() {
  notFound();
}

export function generateStaticParams() {
  return [];
}
