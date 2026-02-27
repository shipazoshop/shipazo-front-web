import { NextRequest, NextResponse } from 'next/server';

// ── Rate Limiting ────────────────────────────────────────────────────────────
// Security: in-memory store (resets on server restart).
// Replace with Redis for multi-instance production deployments.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── Security headers ─────────────────────────────────────────────────────────
// Security: no-store prevents any caching of payment responses.
function getSecurityHeaders(): HeadersInit {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Content-Type': 'application/json',
  };
}

// ── POST handler ─────────────────────────────────────────────────────────────
// Security: only POST is handled — all other methods return 405.
export async function POST(req: NextRequest) {
  const headers = getSecurityHeaders();

  // Security: rate limiting by client IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: 'Demasiadas solicitudes. Por favor espere un momento.' },
      { status: 429, headers },
    );
  }

  // Security: parse body without logging — contains sensitive card data
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Formato de solicitud inválido.' },
      { status: 400, headers },
    );
  }

  // Security: validate required fields by presence only (no logging of values)
  if (!body.orderId || typeof body.orderId !== 'string') {
    return NextResponse.json(
      { success: false, message: 'Orden no especificada.' },
      { status: 400, headers },
    );
  }
  if (!body.cardData || typeof body.cardData !== 'object') {
    return NextResponse.json(
      { success: false, message: 'Datos de pago incompletos.' },
      { status: 400, headers },
    );
  }
  if (!body.customerData || typeof body.customerData !== 'object') {
    return NextResponse.json(
      { success: false, message: 'Datos del cliente incompletos.' },
      { status: 400, headers },
    );
  }

  // Security: backend URL from server-side env (not NEXT_PUBLIC_) when available
  const backendUrl =
    process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: 'Error de configuración del servidor.' },
      { status: 500, headers },
    );
  }

  // Forward Authorization token from original request
  const authorization = req.headers.get('authorization') ?? '';

  try {
    // Security: proxy to backend — card data never stored, never logged
    const backendResponse = await fetch(`${backendUrl}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      // Security: return sanitized message — never expose raw backend errors
      return NextResponse.json(
        {
          success: false,
          message:
            (responseData as Record<string, unknown>).message as string ||
            'No se pudo procesar el pago.',
        },
        { status: backendResponse.status, headers },
      );
    }

    return NextResponse.json(responseData, { status: 200, headers });
  } catch {
    // Security: do not expose internal error details
    return NextResponse.json(
      { success: false, message: 'Error al comunicarse con el servicio de pago.' },
      { status: 502, headers },
    );
  }
}

// Security: explicitly reject non-POST methods
export async function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
export async function PUT() {
  return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
export async function DELETE() {
  return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
