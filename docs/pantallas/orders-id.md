# Detalle de orden

**Ruta:** `/orders/[orderId]`
**Archivos principales:**
- [app/(orders)/orders/[orderId]/page.tsx](../../app/(orders)/orders/[orderId]/page.tsx)
- [presentation/hooks/repositories/useOrdersRepository.ts](../../presentation/hooks/repositories/useOrdersRepository.ts) (`getOrderDetail`)
- [presentation/hooks/repositories/usePaymentRepository.ts](../../presentation/hooks/repositories/usePaymentRepository.ts) (`getPaymentDetail`)
- [shared/utils/invoice.ts](../../shared/utils/invoice.ts) (`invoiceProxyUrl`)
- [domain/entities/order.entity.ts](../../domain/entities/order.entity.ts) (`OrderDetail`)

## Fin
Que el cliente consulte en cualquier momento una orden ya hecha: en qué estado va el envío, qué compró, cuánto pagó y con qué, y que pueda volver a descargar su factura.

## Funcionalidad (nivel producto)
1. El cliente llega desde "Mis órdenes", el historial o el botón "Ver detalles completos" de la confirmación de compra.
2. **Encabezado:** número de orden, fecha, estado del pago (Pagado / Pendiente / Fallido), total y, si la orden tiene factura, el botón naranja **"Descargar factura"**.
3. **Columna izquierda:**
   - Dirección de envío y código postal.
   - Método de pago: marca y últimos 4 dígitos de la tarjeta, código de autorización, monto y cuotas. Si no se pudo obtener el detalle del pago, solo se muestra el método.
   - Resumen: subtotal, envío, impuestos y total.
4. **Columna derecha:**
   - Estado de envío como línea de pasos, marcando la etapa actual.
   - Guía de entrega (proveedor y número), solo si el administrador ya la asignó.
   - Tabla de productos con imagen, nombre (enlace a la tienda original), especificaciones, precio, cantidad y subtotal. Si la especificación es larga, se ve con el botón "Ver especificación" en una ventana.
5. Botón "Volver a mis órdenes".

**Estados:** cargando (spinner), error al cargar, orden no encontrada; en los dos últimos se ofrece volver a "Mis órdenes".

## Estructura
```
page.tsx (client)
 ├─ getOrderDetail(orderId) ──▶ GET /orders/track/:orderId        (backend)
 ├─ getPaymentDetail(paymentId) ──▶ GET /payments/:paymentId       (backend, silencioso)
 └─ Botón "Descargar factura"
       └─ invoiceProxyUrl(invoicePdfUrl) ──▶ GET /api/invoices/pdf (proxy Next) ──▶ FEL
```

- El detalle del pago se pide solo cuando ya se tiene el `paymentId` de la orden.
- El tracking se ordena por `position` y la etapa actual se ubica comparando `currentTrackingStage` con el nombre de cada etapa.
- La guía de entrega se guarda como `"Proveedor: número"` y la pantalla la separa en dos campos.

## Decisiones técnicas y arquitectónicas
- **Descarga de factura por el proxy `/api/invoices/pdf`** — mismo motivo que en la confirmación: la CSP y la falta de CORS de FEL impiden descargar directo desde el navegador. Se reutiliza `invoiceProxyUrl` para no duplicar la construcción de la URL. Ver [order-details](order-details.md) y [rutas-api](../modulos/rutas-api.md).
- **Botón como enlace con `download`, sin `fetch`** — es un clic del usuario, así que el navegador permite la descarga directa; no hace falta el flujo blob que usa la descarga automática de la confirmación.
- **Botón solo si existe `invoicePdfUrl`** — el campo es opcional: órdenes anteriores a la facturación o con certificación fallida no lo traen.
- **Nombre del archivo `factura-<orderNumber>.pdf`** — la orden no trae la serie ni el número de la factura, que sí se usan en la confirmación.
- **Color naranja de marca (`--color-brand-orange`)** — distingue la acción de descarga del resto de la pantalla, que usa el morado de marca.
- **Error del detalle de pago silencioso** — si falla, se muestra el método de pago básico en lugar de romper la pantalla.

## Configuración
| Variable | Uso |
|---|---|
| `FEL_REPORT_HOST` | Host permitido por el proxy de facturas (ver [order-details](order-details.md)) |

## Pendientes conocidos
- **Identificador inconsistente en los enlaces:** "Mis órdenes" usa `order.correlative`, el historial `order.id` y la confirmación `order.orderNumber`, todos hacia `/orders/[orderId]` → `GET /orders/track/:orderId`. Verificar que el backend acepte los tres o unificarlo.
- **La ruta `/orders` no está en el `matcher` de [middleware.ts](../../middleware.ts)**, a diferencia de `/checkout` y `/order-details`. Confirmar si debe requerir sesión.

## Historial de bugs
| Fecha | Síntoma | Causa raíz | Solución | Commit |
|---|---|---|---|---|
