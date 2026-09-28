import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = process.env.FEL_REPORT_HOST;

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
