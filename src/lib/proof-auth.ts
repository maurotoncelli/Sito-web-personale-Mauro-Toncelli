import { createHmac } from "node:crypto";

const SECRET = process.env.PROOF_SECRET ?? "mt-proof-dev-secret";

/** Token firmato che finisce nel cookie: evita che basti indovinare lo slug. */
export function proofToken(slug: string) {
  return createHmac("sha256", SECRET).update(slug).digest("hex").slice(0, 32);
}

export function proofCookieName(slug: string) {
  return `mt_proof_${slug}`;
}
