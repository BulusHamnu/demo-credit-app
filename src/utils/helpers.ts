import crypto from "crypto";

export function generateAccessToken() {
  return crypto.randomUUID();
}
