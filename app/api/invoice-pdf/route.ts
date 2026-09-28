import { NextRequest, NextResponse } from "next/server";

// Solo se permite proxear PDFs del servidor de reportes FEL (evita SSRF).
// Variable server-only (sin NEXT_PUBLIC_) para no exponerla en el bundle del cliente.
const ALLOWED_HOST = process.env.FEL_REPORT_HOST;

/**
 * GET /api/invoice-pdf?url=<pdfUrl>&filename=<nombre.pdf>
 * Descarga server-side el PDF de la factura FEL y lo reenvía como adjunto.
 * Necesario porque el navegador no puede hacer fetch directo a FEL
 * (CSP connect-src + falta de CORS en el servidor del proveedor).
 */
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "factura.pdf";

  if (!ALLOWED_HOST) {
    return NextResponse.json({ error: "Host de facturas no configurado" }, { status: 500 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl ?? "");
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  if (target.protocol !== "https:" || target.hostname !== ALLOWED_HOST) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 400 });
  }

  try {
    const upstream = await fetch(target, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "No se pudo obtener el PDF" }, { status: 502 });
    }

    const safeName = filename.replace(/[^\w.-]/g, "_");
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
