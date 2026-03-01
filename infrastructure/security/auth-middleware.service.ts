const SECRET = process.env.SESSION_SECRET ?? "";

export const SESSION_COOKIE = "auth-session";

export interface SessionPayload {
  isAuthenticated: boolean;
  roleId: string | null;
  isAdmin: boolean;
  exp: number;
}

/**
 * Verifica la firma HMAC-SHA256 de la cookie auth-session y devuelve el payload.
 * Usa Web Crypto API nativa — sin CryptoJS, compatible con Edge Runtime.
 */
export async function verifySession(sessionToken: string): Promise<SessionPayload | null> {
  try {
    const dotIndex = sessionToken.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const payloadB64 = sessionToken.slice(0, dotIndex);
    const signature = sessionToken.slice(dotIndex + 1);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(Buffer.from(signature, "base64url")),
      encoder.encode(payloadB64)
    );

    if (!valid) return null;

    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    ) as SessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
