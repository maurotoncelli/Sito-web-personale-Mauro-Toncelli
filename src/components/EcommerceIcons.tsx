/**
 * Icone line-art per la landing e-commerce (blueprint: niente librerie di icone,
 * solo SVG inline). Stroke sottile e `currentColor` per adattarsi al tema
 * chiaro/scuro. Decorative: aria-hidden, il significato è nel testo accanto.
 */
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Fedeltà cromatica: goccia + tacca di controllo (color checker). */
export function IconColorAccuracy({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3.5c3.2 3.4 5.2 6 5.2 8.7a5.2 5.2 0 0 1-10.4 0c0-2.7 2-5.3 5.2-8.7Z" />
      <path d="M9.4 12.3a2.7 2.7 0 0 0 2.6 2" />
    </svg>
  );
}

/** Dettaglio 61MP: mirino / lente di ingrandimento con crop. */
export function IconDetail({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="11" cy="11" r="6" />
      <path d="M11 8v6M8 11h6" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  );
}

/** Coerenza sul catalogo: griglia uniforme di scatti. */
export function IconConsistency({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}

/** Pronto a pubblicare: file con freccia di export. */
export function IconDelivery({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M13 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V8.5Z" />
      <path d="M13 3.5V8.5H18" />
      <path d="M12 18v-5m0 0-2 2m2-2 2 2" />
    </svg>
  );
}
