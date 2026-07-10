import Image from "next/image";

const logos = [
  { src: "/images/clienti/Alexander-Mcqueen-logo-copia.jpg", alt: "Alexander McQueen" },
  { src: "/images/clienti/Off-White-logo-copia.jpg", alt: "Off-White" },
  { src: "/images/clienti/Akris-logo-copia.jpg", alt: "Akris" },
  { src: "/images/clienti/Slowear-logo-copia.jpg", alt: "Slowear" },
  { src: "/images/clienti/Palm-Angels-logo-copia.jpg", alt: "Palm Angels" },
  { src: "/images/clienti/CALZEDONIA-black-copia.jpg", alt: "Calzedonia" },
  { src: "/images/clienti/Falconeri.jpg", alt: "Falconeri" },
  { src: "/images/clienti/Engels-Volkers-logo-copia.jpg", alt: "Engel & Völkers" },
  { src: "/images/clienti/Castelfalfi-resort-logo-copia.jpg", alt: "Castelfalfi Resort" },
  { src: "/images/clienti/Officine-Bocelli-logo-copia.jpg", alt: "Officine Bocelli" },
];

export function ClientLogos() {
  return (
    <div className="grid grid-cols-3 items-center gap-6 sm:grid-cols-5">
      {logos.map((logo) => (
        <div key={logo.src} className="relative mx-auto h-16 w-full max-w-[120px]">
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            sizes="120px"
            className="object-contain opacity-70 transition-opacity hover:opacity-100 dark:invert"
          />
        </div>
      ))}
    </div>
  );
}
