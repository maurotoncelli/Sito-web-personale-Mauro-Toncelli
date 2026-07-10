import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";
import { site } from "@/data/site";
import { getMessages } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getMessages(locale);
  return { title: m.contact.title, description: m.contact.metaDescription, alternates: pageAlternates(locale, "/contatti") };
}

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = m.contact;
  const serviceOptions = Object.values(m.services.items).map((s) => s.name);

  return (
    <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 md:grid-cols-2 md:px-8">
      <div>
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{c.title}</h1>
        <p className="mt-4 max-w-md text-muted">{c.intro}</p>

        <div className="mt-10 space-y-6 text-sm">
          <div>
            <p className="eyebrow">{c.emailLabel}</p>
            <a href={`mailto:${site.email}`} className="mt-1 inline-block text-lg hover:underline">
              {site.email}
            </a>
          </div>
          <div>
            <p className="eyebrow">{c.whereLabel}</p>
            <p className="mt-1 text-muted">{m.brand.locations}</p>
          </div>
          <div>
            <p className="eyebrow">{c.socialLabel}</p>
            <SocialIcons className="mt-2" />
          </div>
        </div>
      </div>

      <div>
        <ContactForm form={c.form} serviceOptions={serviceOptions} />
      </div>
    </div>
  );
}
