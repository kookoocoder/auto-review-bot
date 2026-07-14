import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "auth_session";
const SECRET = process.env.SESSION_SECRET ?? "default-fallback-super-secret-key-32-chars!";

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToArrayBuffer(hex: string): Uint8Array {
  const length = hex.length / 2;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return uint8;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = enc.encode(SECRET.padEnd(32, "0").slice(0, 32));
  return crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptSession(data: any): Promise<string> {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(JSON.stringify(data))
  );

  const ivHex = arrayBufferToHex(iv.buffer);
  const ciphertextHex = arrayBufferToHex(ciphertext);
  return `${ivHex}:${ciphertextHex}`;
}

export async function decryptSession(token: string): Promise<any | null> {
  try {
    const parts = token.split(":");
    if (parts.length !== 2) return null;
    const [ivHex, ciphertextHex] = parts;
    const key = await getCryptoKey();
    const iv = hexToArrayBuffer(ivHex);
    const ciphertext = hexToArrayBuffer(ciphertextHex);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;
    return await decryptSession(sessionCookie.value);
  } catch (err) {
    return null;
  }
}
