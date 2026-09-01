# Handoff: "Publicar los cambios"

Guía operativa para cualquier agente (Claude Code u otro) que reciba la orden de **publicar los cambios**.

**Resumen en una frase:** commitear lo que haya pendiente, hacer `push` al **padre** cambiando la URL de `origin` con `set-url`, luego `set-url` al **clon** y hacer el mismo `push`, y finalmente **restaurar la URL original** de la carpeta en la que estás.

---

## 1. Cuándo se activa

Frases gatillo: "publica los cambios", "sube los cambios", "publicar", "haz push", "sincroniza los repos".

Cualquiera de ellas activa el **procedimiento completo de la sección 5**, no solo un `git push`.

---

## 2. Las dos URLs

| Rol | URL |
|---|---|
| **Padre** (fuente de verdad, aquí se concentra el código) | `git@github.com:IsseiSuar/shipazo-web-template.git` |
| **Clon** (espejo, recibe exactamente lo mismo) | `git@github.com-shipazoshop:shipazoshop/shipazo-front-web.git` |

**No se usan dos remotos con nombres distintos.** Hay un solo remoto llamado `origin` y se le cambia la URL con `git remote set-url origin <url>` para publicar en cada destino.

Orden obligatorio: **padre primero, clon después**. El clon solo se publica si el push al padre fue exitoso.

---

## 3. Hay DOS carpetas de trabajo y tienen defaults distintos

| Carpeta | URL por defecto de `origin` |
|---|---|
| `C:\Users\Gamer\OneDrive\Desktop\shipazo-web-template` | **Padre** |
| `C:\Users\Gamer\OneDrive\Desktop\shipazo 2\shipazo-web-template` | **Clon** |

Por eso la regla es **guardar la URL actual antes de empezar y restaurarla al final**, en lugar de dejar una URL fija. Nunca asumas cuál es el default: léelo.

```powershell
$urlOriginal = git remote get-url origin
```

Al terminar (con éxito o con error):

```powershell
git remote set-url origin $urlOriginal
```

> Si abandonas el procedimiento a medias sin restaurar, dejas la carpeta apuntando al repo equivocado y el siguiente push va a parar al lugar incorrecto. **Restaurar no es opcional.**

### 3.1 El alias SSH `github.com-shipazoshop`

No es un dominio real: es un **alias SSH** para usar la segunda cuenta de GitHub con otra llave. Requiere esta entrada en `C:\Users\Gamer\.ssh\config`:

```
Host github.com-shipazoshop
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_shipazoshop
  IdentitiesOnly yes
```

Si falla con `Could not resolve hostname` o `Permission denied (publickey)`: **no cambies la URL a `github.com`** para "arreglarlo" — eso rompe la separación de cuentas. Restaura la URL original y reporta el error al usuario.

---

## 4. Árbol de decisión

```
git status --porcelain     → ¿hay cambios sin commitear?
comparar HEAD vs padre     → ¿hay commits sin subir?

┌────────────────────┬───────────────────┬─────────────────────────────────────────────┐
│ Cambios sin commit │ Commits sin subir │ Acción                                      │
├────────────────────┼───────────────────┼─────────────────────────────────────────────┤
│ NO                 │ SÍ                │ push al padre → push al clon                │
│ SÍ                 │ NO                │ add → commit → push al padre → push al clon │
│ SÍ                 │ SÍ                │ add → commit → push al padre → push al clon │
│                    │                   │ (un solo push sube todo junto)              │
│ NO                 │ NO                │ Nada que commitear. Aun así verificar que   │
│                    │                   │ el clon esté al día (paso 5.5) y reportar.  │
└────────────────────┴───────────────────┴─────────────────────────────────────────────┘
```

---

## 5. Procedimiento paso a paso

PowerShell en Windows, desde la raíz del repo. Sustituye `<rama>` por la rama actual en todos los comandos.

### 5.1 Diagnóstico

```powershell
$urlOriginal = git remote get-url origin
$rama = git branch --show-current
$urlOriginal
$rama
git status --short
git log --oneline -5
```

**No cambies de rama en ningún momento.**

Commits pendientes de subir — consulta el padre **sin hacer fetch** (para no ensuciar los refs locales de `origin`, que se comparten entre ambas URLs):

```powershell
git ls-remote git@github.com:IsseiSuar/shipazo-web-template.git refs/heads/<rama>
git rev-parse HEAD
```

- Hashes iguales → no hay commits sin subir.
- Distintos → compara con `git log <hashDelPadre>..HEAD --oneline`. Si el comando falla con `unknown revision`, el local **está atrasado** respecto al padre → ver 7 (`non-fast-forward`).
- El padre no devuelve nada → la rama no existe allá todavía → ver 5.4.

### 5.2 Revisión previa al commit (solo si hay cambios sin commitear)

Antes de agregar nada, mira **qué** se va a subir:

```powershell
git status --short
git diff --stat
```

**Detente y pregunta al usuario** si aparece cualquiera de estos:

- Archivos `.env*`, llaves, certificados, `*.pem`, tokens o credenciales.
- Carpetas de build: `.next/`, `node_modules/`, `*.tsbuildinfo`.
- **Archivos con sufijo `-DESKTOP-XXXXXXX`** (ej. `page-DESKTOP-E3E8OSG.tsx`). Son duplicados que genera OneDrive al detectar conflicto de sincronización entre las dos máquinas. **Nunca los commitees.** La carpeta `shipazo 2` está llena de ellos.
- Archivos > 10 MB no justificados.

No los agregues al `.gitignore` por tu cuenta: repórtalos y espera instrucción.

### 5.3 Commit (solo si hay cambios sin commitear)

```powershell
git add -A
```

Si hubo que excluir archivos según 5.2, agrega solo lo que corresponde en lugar de `-A`:

```powershell
git add <ruta1> <ruta2>
```

Mensaje en **español**, una línea, describiendo lo que realmente cambió (léelo del diff, no lo inventes). Estilo del repo: `Se removieron politicas fuera de negocio`, `Nueva dependencia`.

```powershell
git commit -m @'
<descripción en español de los cambios>

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```

Si falla un hook de pre-commit: **arregla la causa**. Nunca uses `--no-verify`.

### 5.4 Push al PADRE

```powershell
git remote set-url origin git@github.com:IsseiSuar/shipazo-web-template.git
git push origin <rama>
```

Si la rama no existe todavía en el padre, la primera vez usa `git push -u origin <rama>`.

Verifica que salió bien antes de continuar:

```powershell
if ($LASTEXITCODE -ne 0) { git remote set-url origin $urlOriginal; throw "Push al padre falló" }
```

**Si el push al padre falla, no sigas al clon.** Restaura la URL y reporta.

### 5.5 Push al CLON

```powershell
git remote set-url origin git@github.com-shipazoshop:shipazoshop/shipazo-front-web.git
git push origin <rama>
```

Si la rama no existe todavía en el clon: `git push origin <rama>:<rama>`.

> No uses `-u` aquí: el upstream de seguimiento no debe quedar apuntando al clon.

### 5.6 Restaurar la URL original (obligatorio)

```powershell
git remote set-url origin $urlOriginal
git remote -v
```

Confirma que la URL mostrada es la misma que leíste en 5.1.

### 5.7 Verificación final

Sin fetch, consultando ambos repos directamente:

```powershell
git rev-parse HEAD
git ls-remote git@github.com:IsseiSuar/shipazo-web-template.git refs/heads/<rama>
git ls-remote git@github.com-shipazoshop:shipazoshop/shipazo-front-web.git refs/heads/<rama>
```

Los tres hashes deben ser **idénticos**. Si no lo son, no reportes éxito: reporta la discrepancia exacta.

---

## 6. Reglas duras

1. **Nunca** `git push --force` ni `--force-with-lease` sin autorización explícita del usuario en ese momento.
2. **Nunca** `--no-verify` ni saltarse hooks.
3. **Nunca** cambies de rama, ni hagas `merge`, `rebase` o `reset --hard` como parte de este flujo.
4. **Nunca** publiques en el clon antes que en el padre.
5. **Nunca** dejes `origin` apuntando a una URL distinta a la que tenía al empezar. Restaura siempre, incluso al abortar por error.
6. **Nunca** commitees archivos `-DESKTOP-XXXXXXX`, `.env*` ni builds.
7. **Nunca** modifiques código, formato o dependencias "de paso". Publicar es publicar, no refactorizar.
8. **Nunca** crees un Pull Request ni un tag salvo que se pida aparte.
9. Publicar directamente sobre `master` **está autorizado**: es el flujo definido por el usuario. No propongas crear una rama.

---

## 7. Errores comunes

| Error | Causa | Qué hacer |
|---|---|---|
| `! [rejected] ... (non-fast-forward)` / `(fetch first)` | El remoto tiene commits que el local no tiene (la carpeta está atrasada) | **Detente.** Restaura la URL original. Informa al usuario y ofrece `git pull --rebase origin <rama>` con la URL correcta puesta. **No fuerces el push.** |
| `Permission denied (publickey)` al pushear al clon | La llave SSH de `shipazoshop` no está cargada, o falta el alias en `~/.ssh/config` | Restaura la URL original y reporta con el error textual + la config esperada (3.1). No cambies la URL del clon a `github.com`. |
| `Could not resolve hostname github.com-shipazoshop` | Falta la entrada `Host` en `~/.ssh/config` | Igual que el anterior. |
| Push al padre OK, push al clon falla | Desincronización parcial | Restaura la URL y reporta explícitamente: "padre actualizado, clon NO". Es lo más importante a comunicar. |
| Aparecen decenas de archivos `-DESKTOP-E3E8OSG` | Conflictos de sincronización de OneDrive | No los commitees. Reporta y pregunta al usuario si se borran o se conservan. |
| Conflictos de merge sin resolver | Merge a medias | Detente y reporta. No commitees conflictos. |

---

## 8. Reporte final al usuario

Éxito:

```
Publicado.

Carpeta: <ruta>
Rama:    <rama>
Commit:  <hash corto> — <mensaje>

  Padre (IsseiSuar/shipazo-web-template)   → ✅ <hash>
  Clon  (shipazoshop/shipazo-front-web)    → ✅ <hash>

origin restaurado a: <url original>
```

Fallo parcial — dilo sin suavizarlo:

```
Publicación parcial.

  Padre → ✅ <hash>
  Clon  → ❌ falló: <error textual>

El código está seguro en el padre. El clon quedó en <hash anterior>.
origin restaurado a: <url original>
```

---

## 9. Checklist

- [ ] Guardé `$urlOriginal` con `git remote get-url origin`
- [ ] Identifiqué la rama; no cambié de rama
- [ ] Revisé el diff: sin `.env`, sin secretos, sin builds, sin archivos `-DESKTOP-*`
- [ ] Commit hecho (si había cambios) con mensaje en español
- [ ] `set-url` al **padre** → `push` exitoso
- [ ] `set-url` al **clon** → `push` exitoso
- [ ] `set-url` de vuelta a `$urlOriginal` y verificado con `git remote -v`
- [ ] `HEAD`, padre y clon apuntan al mismo hash (`git ls-remote`)
- [ ] Reporte entregado al usuario
