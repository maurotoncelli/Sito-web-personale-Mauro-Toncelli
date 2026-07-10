import nodemailer from "nodemailer";
import { site } from "@/data/site";

/**
 * Invio del form contatti via SMTP Netsons (blueprint §14): la casella
 * @maurotoncelli.it resta su Netsons, il sito la usa solo per spedire.
 * Env richieste (Vercel + .env.local): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 * Finché mancano, risponde 503 e il form ripiega sul mailto.
 */
export async function POST(req: Request) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return Response.json({ ok: false, error: "smtp-not-configured" }, { status: 503 });
  }

  let data: { nome?: string; email?: string; servizio?: string; messaggio?: string; sito?: string };
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // honeypot: i bot compilano anche il campo nascosto "sito"
  if (data.sito) return Response.json({ ok: true });

  const nome = (data.nome ?? "").trim().slice(0, 200);
  const email = (data.email ?? "").trim().slice(0, 200);
  const servizio = (data.servizio ?? "").trim().slice(0, 200);
  const messaggio = (data.messaggio ?? "").trim().slice(0, 5000);
  if (!nome || !messaggio || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid-fields" }, { status: 400 });
  }

  const port = Number(SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Sito maurotoncelli.it" <${SMTP_USER}>`,
      to: site.email,
      replyTo: `"${nome.replace(/"/g, "'")}" <${email}>`,
      subject: `Richiesta preventivo${servizio ? ` — ${servizio}` : ""}`,
      text: `${messaggio}\n\n—\n${nome}\n${email}${servizio ? `\nServizio: ${servizio}` : ""}`,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact form send failed:", err);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
}
