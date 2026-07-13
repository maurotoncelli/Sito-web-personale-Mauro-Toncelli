/**
 * Loader "diaframma" (blueprint §3): un'apertura circolare rivela la pagina
 * al primo caricamento della sessione.
 *
 * Renderizzato lato server e visibile fin dal primo paint, così non c'è mai
 * il flash "pagina → animazione → pagina": la pagina nasce già coperta e il
 * diaframma la rivela. Uno script inline in <head> (prima del paint) imposta
 * data-iris="off" su <html> se l'animazione è già stata vista nella sessione
 * o se l'utente preferisce ridurre il movimento; il CSS la nasconde.
 * Tutta l'animazione è CSS puro: si completa anche senza JavaScript.
 */
export function IrisLoader() {
  return (
    <div
      aria-hidden
      className="iris-loader pointer-events-none fixed inset-0 z-[100]"
      style={{ animation: "iris-fade 0.4s ease 1.2s forwards" }}
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="iris-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle
              cx="50%"
              cy="50%"
              r="4%"
              fill="black"
              style={{ animation: "iris-open 1.2s cubic-bezier(0.7, 0, 0.3, 1) forwards" }}
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#0a0a0a" mask="url(#iris-mask)" />
      </svg>
    </div>
  );
}
