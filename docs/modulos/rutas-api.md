# Rutas de API internas (Next.js)

**Ruta:** Transversal
**Archivos principales:**
- [infrastructure/config/api.config.ts](../../infrastructure/config/api.config.ts) (`INTERNAL_API`)
- [app/api/](../../app/api/) (route handlers)

## Fin
Tener un solo lugar donde se definen las rutas `app/api/...` que consume el front, con un formato de nombres consistente, para que cambiar o encontrar una ruta no dependa de buscar strings sueltos por el código.

## Funcionalidad (nivel producto)
No es visible para el usuario. Estas rutas son el "backend del front" (BFF): hacen cosas que el navegador no puede o no debe hacer directo, como emitir la cookie de sesión, procesar el pago sin exponer datos de tarjeta o descargar la factura de FEL.

## Estructura

### Dos tipos de endpoints
| Tipo | Dónde vive | Cómo se referencia |
|---|---|---|
| **Backend externo** (Railway, `NEXT_PUBLIC_PRODUCTS_API_URL`) | Otro repo | `URL_DICTIONARY` o `endpoint` en los repositorios (`presentation/hooks/repositories/`) |
| **Interno** (route handlers de Next, `app/api/...`) | Este repo | **Siempre** vía `INTERNAL_API` |

### Rutas internas actuales
| Clave | Ruta | Método(s) | Handler | Uso |
|---|---|---|---|---|
| `AUTH_SESSION` | `/api/auth/session` | POST, DELETE | [route.ts](../../app/api/auth/session/route.ts) | Emitir/borrar la cookie del middleware ([auth-sesion](auth-sesion.md)) |
| `PAYMENTS_PROCESS` | `/api/v1/payments/process` | POST | [route.ts](../../app/api/v1/payments/process/route.ts) | Proxy de pago con rate limiting |
| `INVOICES_PDF` | `/api/invoices/pdf` | GET | [route.ts](../../app/api/invoices/pdf/route.ts) | Proxy de descarga de factura FEL ([order-details](../pantallas/order-details.md)) |

## Convención para rutas nuevas
1. **Formato:** `/api/<recurso>/<acción-o-subrecurso>`
   - Recurso en **plural** y **kebab-case**: `/api/invoices/pdf`, `/api/auth/session`.
   - La carpeta en `app/api/` refleja la ruta exacta: `app/api/invoices/pdf/route.ts`.
2. **Sin versión** (`/v1`) en rutas nuevas.
3. **Registrar la ruta en `INTERNAL_API`** con clave `RECURSO_ACCION` en MAYÚSCULAS. Nunca escribir `"/api/..."` directo en componentes, stores o hooks.
4. Parámetros de consulta con `URLSearchParams`, nunca concatenando strings.
5. Agregar la ruta a la tabla de arriba.

## Decisiones técnicas y arquitectónicas
- **Diccionario central `INTERNAL_API`** — antes cada ruta estaba escrita a mano donde se usaba, y con formatos distintos. Centralizarla evita errores de tipeo y permite cambiar una ruta en un solo lugar. Vive en `api.config.ts` junto a `URL_DICTIONARY` para que toda la configuración de endpoints esté en un mismo archivo. `as const` hace que TypeScript conozca cada ruta exacta.
- **Sin versionado en rutas internas** — se despliegan junto con el front, así que nunca hay un cliente viejo usando una versión anterior. El backend externo sí debe versionarse porque lo consumen clientes que se despliegan por separado.
  - *Excepción heredada:* `/api/v1/payments/process` conserva el `v1`. Moverlo toca el flujo de pago y se hará aparte, con pruebas.
- **`invoice-pdf` → `invoices/pdf`** — se renombró para seguir la convención de recurso en plural + subrecurso.

## Pendientes conocidos
- Migrar `/api/v1/payments/process` a `/api/payments/process` (cambiar carpeta y el valor en `INTERNAL_API`; probar el pago de punta a punta).
- Los endpoints del **backend externo** siguen mayormente escritos a mano en cada repositorio (`endpoint: '/orders/...'`); solo algunos están en `URL_DICTIONARY`. Unificarlos es un trabajo aparte.

## Historial de bugs
| Fecha | Síntoma | Causa raíz | Solución | Commit |
|---|---|---|---|---|
