import crypto from "crypto";

export function generateAccessToken(): string {
  return crypto.randomUUID();
}

export function generateTransactionReference(): string {
  return `TNX_` + crypto.randomBytes(20).toString("hex");
}
