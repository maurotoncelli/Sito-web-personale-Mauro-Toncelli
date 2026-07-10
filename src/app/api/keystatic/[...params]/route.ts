import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

/**
 * In modalità GitHub servono le env della GitHub App (KEYSTATIC_GITHUB_CLIENT_ID,
 * KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET). Finché non sono impostate
 * su Vercel il pannello risponde 503 invece di far fallire la build.
 */
const configured =
  // in sviluppo Keystatic serve anche il wizard di creazione della GitHub App
  process.env.NODE_ENV === "development" ||
  process.env.KEYSTATIC_STORAGE === "local" ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET
  );

const nonConfigurato = () =>
  new Response(
    "Keystatic non configurato: creare la GitHub App e impostare le env KEYSTATIC_* (vedi README).",
    { status: 503 }
  );

export const { POST, GET } = configured
  ? makeRouteHandler({ config })
  : { POST: nonConfigurato, GET: nonConfigurato };
