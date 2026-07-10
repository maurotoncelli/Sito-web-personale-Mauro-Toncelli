import { CtaLink } from "@/components/CtaLink";

export function CtaSection({
  locale,
  title,
  subtitle,
  button,
}: {
  locale: string;
  title: string;
  subtitle: string;
  button: string;
}) {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-20 text-center md:px-8">
        <h2 className="text-2xl md:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">{subtitle}</p>
        <CtaLink
          href={`/${locale}/contatti`}
          className="mt-8 inline-block border border-foreground px-8 py-3 text-[13px] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          {button}
        </CtaLink>
      </div>
    </section>
  );
}
