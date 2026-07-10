"use client";

import { useState } from "react";
import { site } from "@/data/site";
import type { Messages } from "@/i18n";
import { trackEvent } from "./Analytics";

/**
 * Form contatti: invia via /api/contact (SMTP Netsons). Se il backend non è
 * configurato o fallisce, ripiega sul mailto come prima.
 */
export function ContactForm({
  form,
  serviceOptions,
}: {
  form: Messages["contact"]["form"];
  serviceOptions: string[];
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [servizio, setServizio] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [stato, setStato] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (stato === "sending") return;
    setStato("sending");
    trackEvent("contact_form_submit", { service: servizio || "n/a" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, servizio, messaggio, sito: honeypot }),
      });
      if (res.ok) {
        setStato("sent");
        return;
      }
      if (res.status === 503) {
        // SMTP non configurato: fallback mailto
        const subject = encodeURIComponent(`${form.subjectPrefix}${servizio ? ` — ${servizio}` : ""}`);
        const body = encodeURIComponent(`${messaggio}\n\n${nome}\n${email}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        setStato("idle");
        return;
      }
      setStato("error");
    } catch {
      setStato("error");
    }
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";

  if (stato === "sent") {
    return (
      <p className="border border-border bg-surface px-6 py-8 text-center text-[15px]">
        {form.success}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="eyebrow">
          {form.name}
        </label>
        <input
          id="nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={`mt-2 ${field}`}
          placeholder={form.namePlaceholder}
        />
      </div>
      <div>
        <label htmlFor="email" className="eyebrow">
          {form.email}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-2 ${field}`}
          placeholder={form.emailPlaceholder}
        />
      </div>
      {/* honeypot antispam: invisibile agli utenti, i bot lo compilano */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="sito">Sito web</label>
        <input
          id="sito"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="servizio" className="eyebrow">
          {form.service}
        </label>
        <select
          id="servizio"
          value={servizio}
          onChange={(e) => setServizio(e.target.value)}
          className={`mt-2 ${field}`}
        >
          <option value="">{form.servicePlaceholder}</option>
          {serviceOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value={form.droneOption}>{form.droneOption}</option>
          <option value={form.otherOption}>{form.otherOption}</option>
        </select>
      </div>
      <div>
        <label htmlFor="messaggio" className="eyebrow">
          {form.message}
        </label>
        <textarea
          id="messaggio"
          required
          rows={6}
          value={messaggio}
          onChange={(e) => setMessaggio(e.target.value)}
          className={`mt-2 ${field}`}
          placeholder={form.messagePlaceholder}
        />
      </div>
      {stato === "error" && <p className="text-sm text-red-600">{form.error}</p>}
      <button
        type="submit"
        disabled={stato === "sending"}
        className="border border-foreground px-8 py-3 text-[13px] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {stato === "sending" ? form.sending : form.submit}
      </button>
    </form>
  );
}
