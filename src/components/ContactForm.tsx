"use client";

import { useState } from "react";
import { site } from "@/data/site";
import type { Messages } from "@/i18n";
import { trackEvent } from "./Analytics";

/**
 * Form senza backend: compone una mail pronta all'invio (mailto) e traccia
 * la conversione in GA4. Sostituibile con un endpoint serverless in seguito.
 */
export function ContactForm({
  form,
  serviceOptions,
}: {
  form: Messages["contact"]["form"];
  serviceOptions: string[];
}) {
  const [nome, setNome] = useState("");
  const [servizio, setServizio] = useState("");
  const [messaggio, setMessaggio] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    trackEvent("contact_form_submit", { service: servizio || "n/a" });
    const subject = encodeURIComponent(`${form.subjectPrefix}${servizio ? ` — ${servizio}` : ""}`);
    const body = encodeURIComponent(`${messaggio}\n\n${nome}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";

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
      <button
        type="submit"
        className="border border-foreground px-8 py-3 text-[13px] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
      >
        {form.submit}
      </button>
    </form>
  );
}
