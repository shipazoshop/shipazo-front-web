# Confirmación de orden

**Ruta:** `/order-details`
**Archivos principales:**
- [app/(products)/order-details/page.tsx](../../app/(products)/order-details/page.tsx)
- [presentation/components/shop-cart/OrderDetails.tsx](../../presentation/components/shop-cart/OrderDetails.tsx)
- [app/api/invoice-pdf/route.ts](../../app/api/invoice-pdf/route.ts)
- [presentation/hooks/repositories/useOrdersRepository.ts](../../presentation/hooks/repositories/useOrdersRepository.ts) (`certifyInvoice`)
- [application/stores/useNewOrderStore.ts](../../application/stores/useNewOrderStore.ts)

## Fin
Confirmar al cliente que su orden fue creada y pagada, mostrarle el resumen y entregarle su factura electrónica (FEL) certificada.

## Funcionalidad (nivel producto)
1. El cliente llega aquí automáticamente después de pagar en `/checkout`.
2. Ve el mensaje "Gracias. Tu orden ha sido recibida." con número de orden, fecha, total y método de pago.
3. En segundo plano se certifica la factura:
   - **Éxito y descarga automática:** "Tu factura fue certificada y se descargó automáticamente…" con enlace para descargarla de nuevo.
   - **Éxito pero la descarga automática falló:** "Tu factura fue certificada." con enlace "descárgala aquí".
   - **Error de certificación:** aviso rojo indicando que la orden y el pago están bien, pero debe contactar a soporte por la factura.
4. Ve el detalle de productos, subtotal, envío, impuestos, total y dirección de envío.
5. Puede ir a "Ver detalles completos" (`/orders/<número>`) o "Continuar comprando".

Si entra sin una orden en memoria, ve "No se encontró información de la orden" y un botón para volver al inicio. La ruta requiere sesión (la protege `middleware.ts`).

## Estructura
```
Checkout.tsx ──setOrder()──▶ useNewOrderStore ──▶ OrderDetails.tsx
                                                     │
                     POST /orders/:id/invoice ◀──────┤ (certifyInvoice, una vez)
                                                     │
                                                     ▼  pdfUrl (servidor FEL)
                     GET /api/invoice-pdf?url&filename  (proxy Next, same-origin)
                                                     │
                                                     ▼
                                   report.feel.com.gt (server-to-server)
```

- `OrderDetails` lee la orden de `useNewOrderStore`, que llenó `Checkout` antes de redirigir.
- Un `useEffect` protegido con `useRef` dispara la certificación **una sola vez** (evita el doble disparo de StrictMode).
- Con el `pdfUrl` que devuelve la API, se descarga el PDF a través del proxy `/api/invoice-pdf`.

## Decisiones técnicas y arquitectónicas
- **Certificación no bloqueante** — la orden ya está creada y pagada; un fallo de FEL no debe verse como un fallo de compra. Se muestra un aviso y se deriva a soporte.
- **Proxy server-side para el PDF (`/api/invoice-pdf`)** — el navegador no puede hacer `fetch` directo a FEL: la CSP (`connect-src`) solo permite nuestro dominio y la API, FEL no envía headers CORS, y el atributo `download` no funciona con URLs de otro dominio. El proxy responde desde nuestro dominio con `Content-Disposition: attachment`.
  - *Descartado:* agregar FEL a `connect-src` (no resuelve CORS y abre la CSP).
- **Allowlist de host en el proxy** — el proxy solo acepta `https://` y el host de `FEL_REPORT_HOST`. Sin esto, cualquiera podría usar nuestro servidor para pedir URLs arbitrarias (SSRF).
- **Host de FEL en variable de entorno server-only** — sin prefijo `NEXT_PUBLIC_` para que no llegue al bundle del cliente. Si falta, el endpoint responde 500 en lugar de permitir cualquier host.
- **Sin `window.open` como fallback** — después de un `await` ya no hay gesto del usuario y el bloqueador de popups lo detiene sin avisar; con `noopener` ni siquiera se puede detectar. El fallback es el enlace visible, que sí cuenta como gesto.
- **Mensaje de éxito condicionado a la descarga real** — antes se mostraba "se descargó" aunque la descarga hubiera fallado.

## Configuración
| Variable | Dónde | Ejemplo |
|---|---|---|
| `FEL_REPORT_HOST` | `.env` local y variables de producción | `report.feel.com.gt` (solo hostname) |

La CSP está en [next.config.ts](../../next.config.ts). No hace falta modificarla para las facturas.

## Pendientes conocidos
- `POST /orders/:id/invoice` responde **409** si la orden ya tenía factura (p. ej. al recargar la página). Hoy eso muestra el aviso de error. Lo ideal es que la API devuelva el `pdfUrl` existente, o que el front trate el 409 como "ya certificada".

## Historial de bugs
| Fecha | Síntoma | Causa raíz | Solución | Commit |
|---|---|---|---|---|
| 2026-09-27 | En producción la factura no se descargaba, aunque se mostraba "se descargó automáticamente". | La CSP `connect-src` bloqueaba el `fetch` a FEL (y FEL no tiene CORS); el fallback `window.open` lo bloqueaba el navegador; el mensaje de éxito no dependía del resultado. | Proxy `/api/invoice-pdf` con allowlist por `FEL_REPORT_HOST`; mensaje según el resultado real; enlace manual por el proxy. | `b9c58dd` |
