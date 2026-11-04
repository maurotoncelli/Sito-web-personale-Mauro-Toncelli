import Image from "next/image";

const logos = [
  { src: "/images/clienti/Alexander-Mcqueen-logo-copia.jpg", name: "Alexander McQueen" },
  { src: "/images/clienti/Off-White-logo-copia.jpg", name: "Off-White" },
  { src: "/images/clienti/Akris-logo-copia.jpg", name: "Akris" },
  { src: "/images/clienti/Slowear-logo-copia.jpg", name: "Slowear" },
  { src: "/images/clienti/Palm-Angels-logo-copia.jpg", name: "Palm Angels" },
  { src: "/images/clienti/CALZEDONIA-black-copia.jpg", name: "Calzedonia" },
  { src: "/images/clienti/Falconeri.jpg", name: "Falconeri" },
  { src: "/images/clienti/Engels-Volkers-logo-copia.jpg", name: "Engel & Völkers" },
  { src: "/images/clienti/Castelfalfi-resort-logo-copia.jpg", name: "Castelfalfi Resort" },
  { src: "/images/clienti/Officine-Bocelli-logo-copia.jpg", name: "Officine Bocelli" },
  { src: "/images/clienti/IAMFA-logo.jpg", name: "IAMFA" },
  { src: "/images/clienti/IOLC-logo.jpg", name: "IOLC" },
  { src: "/images/clienti/The-Hoxton-logo.jpg", name: "The Hoxton Florence" },
];

export function ClientLogos() {
  return (
    <div className="grid grid-cols-3 items-center gap-6 sm:grid-cols-4 lg:grid-cols-6">
      {logos.map((logo) => (
        <div key={logo.src} className="group flex flex-col items-center">
          <div className="relative mx-auto h-16 w-full max-w-[120px]">
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              sizes="120px"
              className="object-contain opacity-70 transition-opacity group-hover:opacity-100 dark:invert"
            />
          </div>
          <span className="mt-1.5 text-center text-[11px] font-medium tracking-[0.12em] uppercase text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {logo.name}
          </span>
        </div>
      ))}
    </div>
  );
}
