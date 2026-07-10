import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { proofPasswords } from "@/data/proof";
import { proofCookieName, proofToken } from "@/lib/proof-auth";
import { getMessages, isLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return {
    title: m.proof.title,
    description: m.proof.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function ProofLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { error } = await searchParams;
  const m = getMessages(locale);

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "").trim();
    const match = Object.entries(proofPasswords()).find(([, pw]) => pw === password);
    if (!match) redirect(`/${locale}/proof?error=1`);
    const [slug] = match;
    const store = await cookies();
    store.set(proofCookieName(slug), proofToken(slug), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    redirect(`/${locale}/proof/${slug}`);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-24 md:py-32">
      <p className="eyebrow">{m.proof.eyebrow}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{m.proof.title}</h1>
      <p className="mt-4 text-muted">{m.proof.intro}</p>

      <form action={login} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium tracking-[0.1em] uppercase">
            {m.proof.passwordLabel}
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="off"
            className="border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-foreground"
          />
        </label>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{m.proof.error}</p>}
        <button
          type="submit"
          className="mt-2 border border-foreground bg-foreground px-6 py-3 text-[13px] font-medium tracking-[0.15em] uppercase text-background transition-colors hover:bg-transparent hover:text-foreground"
        >
          {m.proof.submit}
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">{m.proof.help}</p>
    </div>
  );
}
