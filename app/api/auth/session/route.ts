import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.SESSION_SECRET!;
const ADMIN_ROLE_ID = process.env.NEXT_PUBLIC_ADMIN_ID!;
const SESSION_COOKIE = "auth-session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 días

/**
 * Codifica un string a Base64 URL-safe (sin padding)
 */
function toBase64Url(str: string): string {
  return Buffer.from(str).toString("base64url");
}

/**
 * Genera un HMAC-SHA256 usando Web Crypto API nativa (Edge-compatible)
 */
async function hmacSign(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Buffer.from(signature).toString("base64url");
}

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Solo se usa server-side para leer roleId desde un token confiable.
 */
function decodeJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

/**
 * POST /api/auth/session
 * Recibe el accessToken de Zustand y emite una cookie de sesión liviana
 * firmada con HMAC, que el middleware puede verificar sin CryptoJS.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken } = body as { accessToken?: string };

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const jwtPayload = decodeJWTPayload(accessToken);
    if (!jwtPayload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const roleId = jwtPayload.roleId as string | undefined;
    const sessionPayload = {
      isAuthenticated: true,
      roleId: roleId ?? null,
      isAdmin: roleId === ADMIN_ROLE_ID,
      exp: Math.floor(Date.now() / 1000) + MAX_AGE,
    };

    const payloadB64 = toBase64Url(JSON.stringify(sessionPayload));
    const signature = await hmacSign(payloadB64);
    const sessionToken = `${payloadB64}.${signature}`;

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Elimina la cookie de sesión al hacer logout.
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
