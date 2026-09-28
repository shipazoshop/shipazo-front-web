# Documentación del proyecto

La documentación vive aquí y **no en comentarios del código**. El código se mantiene limpio; el "por qué" de cada decisión se registra en estos archivos.

## Regla de trabajo

Cada vez que se resuelve un bug:

1. Identifica la pantalla (o módulo transversal) afectada.
2. Si **no tiene** documento, créalo con la plantilla de abajo.
3. Si **ya tiene**, actualiza las secciones afectadas y agrega el bug al historial.
4. El documento se commitea junto con el fix (o en el mismo push).

## Estructura

```
docs/
├── README.md                     ← este archivo (convención + plantilla)
├── HANDOFF-PUBLICAR-CAMBIOS.md   ← procedimiento de publicación
├── pantallas/                    ← una por ruta de la app
│   └── <ruta>.md                 (ej. order-details.md)
└── modulos/                      ← lógica transversal que afecta varias pantallas
    └── <modulo>.md               (ej. auth-sesion.md: stores, middleware, servicios)
```

- **Pantalla**: algo que el usuario ve en una ruta (`/checkout`, `/order-details`).
- **Módulo**: algo que no es una pantalla pero afecta a muchas (sesión, carrito, cliente HTTP).

Nombres de archivo en minúsculas con guiones, igual que la ruta o el módulo.

## Índice

### Pantallas
- [order-details](pantallas/order-details.md) — Confirmación de orden y descarga de factura FEL

### Módulos
- [auth-sesion](modulos/auth-sesion.md) — Tokens, cookie de sesión del middleware y sincronización entre pestañas
- [rutas-api](modulos/rutas-api.md) — Convención y registro de rutas internas `app/api/...` (`INTERNAL_API`)

## Plantilla

```markdown
# <Nombre de la pantalla o módulo>

**Ruta:** `/ruta` (o "Transversal")
**Archivos principales:** enlaces a page.tsx, componentes, stores, endpoints

## Fin
Para qué existe, en una o dos frases. Qué problema del negocio resuelve.

## Funcionalidad (nivel producto)
Qué ve y qué puede hacer el usuario, paso a paso. Estados posibles
(carga, éxito, error, vacío). Sin jerga técnica.

## Estructura
Cómo está armado: componentes, stores, hooks, endpoints que consume,
y cómo fluye la información entre ellos.

## Decisiones técnicas y arquitectónicas
Cada decisión con su porqué y la alternativa descartada:
- **Decisión** — por qué — qué se descartó y por qué.

## Configuración
Variables de entorno, headers, dependencias externas.

## Historial de bugs
| Fecha | Síntoma | Causa raíz | Solución | Commit |
|---|---|---|---|---|
```
