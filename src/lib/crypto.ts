import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  // Use scryptSync to generate a key of length 64
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashWithSalt: string): boolean {
  const parts = hashWithSalt.split(":");
  if (parts.length !== 2) return false;
  const [salt, originalHash] = parts;
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  
  // Use timingSafeEqual to prevent timing attacks
  const bufferA = Buffer.from(originalHash, "hex");
  const bufferB = Buffer.from(hash, "hex");
  
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
}
