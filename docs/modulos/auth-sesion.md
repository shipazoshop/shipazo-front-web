# Sesión y autenticación (cliente)

**Ruta:** Transversal (afecta todas las pantallas)
**Archivos principales:**
- [application/stores/useAuthStore.ts](../../application/stores/useAuthStore.ts)
- [app/api/auth/session/route.ts](../../app/api/auth/session/route.ts)
- [middleware.ts](../../middleware.ts)
- [infrastructure/security/session.service.ts](../../infrastructure/security/session.service.ts)
- [infrastructure/security/encryption.service.ts](../../infrastructure/security/encryption.service.ts)

## Fin
Mantener al usuario autenticado entre recargas y pestañas, renovar los tokens sin que lo note, y permitir que el middleware proteja rutas (`/checkout`, `/order-details`, `/configurations`, `/admin`) sin acceso al localStorage.

## Funcionalidad (nivel producto)
- El usuario inicia sesión una vez y sigue autenticado al recargar o abrir nuevas pestañas.
- Si el token expira, se renueva en segundo plano; solo si la renovación falla se le manda al login, recordando a dónde quería ir.
- Si cierra sesión en una pestaña, las demás se enteran.
- Si intenta entrar a una ruta protegida sin sesión, se le redirige al login (o al inicio).

## Estructura
```
Login / refresh ──setTokens()──▶ useAuthStore ──persist (AES)──▶ localStorage "auth-storage"
                                     │                                   │
                                     │ syncSessionCookie()               │ evento "storage"
                                     ▼                                   ▼
                          POST /api/auth/session              otras pestañas: rehydrate()
                                     │                         (solo lectura)
                                     ▼
                     cookie httpOnly "auth-session" (HMAC) ──▶ middleware.ts (Edge)
```

- **`useAuthStore`** (Zustand + `persist`): guarda `accessToken`, `refreshToken` e `isAuthenticated` cifrados en localStorage. `isHydrated` vive solo en memoria.
- **`/api/auth/session`**: recibe el accessToken y emite una cookie ligera firmada con HMAC (`isAuthenticated`, `roleId`, `isAdmin`). `DELETE` la elimina.
- **`middleware.ts`**: verifica esa cookie en el Edge para proteger rutas.
- **`session.service`**: único punto de refresh (deduplicado con una promesa compartida porque el backend rota el refreshToken) y de logout forzado.

## Decisiones técnicas y arquitectónicas
- **Cookie de sesión separada del token** — el middleware corre en Edge y no puede leer localStorage ni usar CryptoJS. Una cookie HMAC pequeña le da lo necesario (autenticado y rol) sin exponer el JWT.
- **Solo la hidratación inicial tiene efectos** — en `onRehydrateStorage`, si `isHydrated` ya es `true` la rehidratación viene de otra pestaña y **solo lee**: no llama a `setHydrated()` ni renueva la cookie. La cookie es compartida entre pestañas y la pestaña que cambió el token ya la renovó.
  - *Por qué es necesario:* el cifrado AES con passphrase usa salt aleatorio, así que cada escritura produce un valor distinto en localStorage aunque el contenido sea el mismo, y eso dispara `storage` en las demás pestañas. Si la rehidratación escribiera, las pestañas se rebotarían el evento sin fin.
  - *Descartado:* comparar el contenido descifrado antes de escribir y deduplicar el POST por token. Funcionaba, pero ocultaba el síntoma en vez de eliminar el efecto indebido.
- **`isHydrated` fuera de `partialize`** — al no persistirse, su valor siempre viene de la memoria de cada pestaña (el `merge` de Zustand combina persistido + memoria). Eso permite distinguir la primera hidratación de las siguientes.
- **Sincronización entre pestañas con `rehydrate()`** — evita que una pestaña se quede con un refreshToken ya rotado e invalidado.

## Configuración
| Variable | Uso |
|---|---|
| `SESSION_SECRET` | Firma HMAC de la cookie `auth-session` (server-only) |
| `NEXT_PUBLIC_ADMIN_ID` | Rol que se marca como admin en la cookie |
| `NEXT_PUBLIC_ENCRYPTION_KEY` | Llave AES del localStorage |

## Pendientes conocidos
- `NEXT_PUBLIC_ENCRYPTION_KEY` viaja en el bundle del navegador, así que el cifrado del localStorage solo oculta el contenido; no protege contra código JS que corra en la página. La protección real sería guardar el refreshToken en una cookie `httpOnly`.

## Historial de bugs
| Fecha | Síntoma | Causa raíz | Solución | Commit |
|---|---|---|---|---|
| 2026-09-28 | Al escribir en campos de texto (checkout, buscadores, filtros) se disparaban ~100 POST a `/api/auth/session`. | Con 2+ pestañas abiertas, cada rehidratación por evento `storage` volvía a escribir (`setHydrated`) con un cifrado nuevo y hacía el POST, rebotando entre pestañas. | `onRehydrateStorage` solo aplica efectos en la hidratación inicial. | `7c963ad` |
