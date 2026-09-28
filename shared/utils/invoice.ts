import { INTERNAL_API } from "@/infrastructure/config/api.config";

/** Arma la URL del proxy de descarga de facturas. */
export function invoiceProxyUrl(url: string, filename: string): string {
  const params = new URLSearchParams({ url, filename });
  return `${INTERNAL_API.INVOICES_PDF}?${params.toString()}`;
}
