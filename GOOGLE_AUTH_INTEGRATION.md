# Integración de Google OAuth - Guía de Implementación

## 📋 Resumen

La pantalla de login ya está creada y lista para integrar con Google OAuth. Este documento te guiará a través de los pasos necesarios para completar la integración.

## 🎨 Pantalla de Login Creada

- ✅ Ruta: `/login` - [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)
- ✅ Componente: [LoginForm.tsx](presentation/components/auth/LoginForm.tsx)
- ✅ Estilos: [_auth.scss](public/scss/component/_auth.scss)

## 🔧 Opciones de Implementación

### Opción 1: NextAuth.js (Recomendado)

NextAuth.js es la solución más popular para autenticación en Next.js.

#### 1. Instalar dependencias

```bash
npm install next-auth@latest
```

#### 2. Crear archivo de configuración de NextAuth

Crea `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

#### 3. Configurar variables de entorno

Agrega a tu archivo `.env`:

```env
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
NEXTAUTH_SECRET=genera_un_secret_aleatorio
NEXTAUTH_URL=http://localhost:3000
```

#### 4. Actualizar LoginForm.tsx

Reemplaza la función `handleGoogleLogin` en [LoginForm.tsx](presentation/components/auth/LoginForm.tsx):

```typescript
import { signIn } from "next-auth/react";

const handleGoogleLogin = async () => {
  setIsLoading(true);
  try {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    setIsLoading(false);
  }
};
```

#### 5. Crear SessionProvider

Crea `app/providers/SessionProvider.tsx`:

```typescript
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Actualiza `app/layout.tsx` para incluir el provider:

```typescript
import AuthSessionProvider from "./providers/SessionProvider";

// ... dentro del return
<AuthSessionProvider>
  <QueryProvider>
    {children}
    <Modals />
  </QueryProvider>
</AuthSessionProvider>
```

### Opción 2: Firebase Auth

Si prefieres usar Firebase:

#### 1. Instalar Firebase

```bash
npm install firebase
```

#### 2. Configurar Firebase

Crea `lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

#### 3. Actualizar LoginForm.tsx

```typescript
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const handleGoogleLogin = async () => {
  setIsLoading(true);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Usuario autenticado:", user);
    // Redirigir a la página principal
    window.location.href = "/";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    setIsLoading(false);
  }
};
```

## 🔐 Configurar Google Cloud Console

Independientemente de la opción elegida, necesitas configurar Google Cloud Console:

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente

### 2. Habilitar Google+ API

1. En el menú, ve a "APIs y servicios" > "Biblioteca"
2. Busca "Google+ API" y habilítala

### 3. Configurar OAuth Consent Screen

1. Ve a "APIs y servicios" > "Pantalla de consentimiento de OAuth"
2. Configura los detalles de tu aplicación
3. Agrega los scopes necesarios (email, profile)

### 4. Crear credenciales OAuth 2.0

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente de OAuth"
3. Selecciona "Aplicación web"
4. Agrega las URIs autorizadas:
   - **Orígenes JavaScript autorizados:**
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **URIs de redireccionamiento autorizadas:**
     - NextAuth: `http://localhost:3000/api/auth/callback/google`
     - Firebase: `http://localhost:3000/__/auth/handler`

5. Copia el Client ID y Client Secret

## 🎯 Próximos Pasos

1. **Elegir opción de autenticación** (NextAuth o Firebase)
2. **Instalar dependencias** necesarias
3. **Configurar Google Cloud Console**
4. **Actualizar variables de entorno**
5. **Implementar lógica de autenticación** en LoginForm
6. **Proteger rutas** que requieran autenticación
7. **Gestionar estado de sesión** en toda la aplicación

## 📱 Características de la Pantalla de Login

### Diseño
- ✅ Diseño moderno y minimalista
- ✅ Responsive (adaptado a móviles)
- ✅ Animaciones suaves
- ✅ Decoraciones de fondo animadas
- ✅ Botón de Google con iconografía oficial

### UX
- ✅ Estados de carga (loading)
- ✅ Mensajes informativos sobre seguridad
- ✅ Enlaces a términos y privacidad
- ✅ Hover effects y micro-interacciones

### Colores
Usa el sistema de colores semántico refactorizado:
- `--color-brand-red`: Color principal
- `--color-brand-blue`: Color de seguridad
- `--color-white`: Fondo de tarjeta
- `--color-text-primary`: Texto principal
- `--color-gray-light`: Bordes y divisores

## 🔒 Seguridad

Recuerda:
- ✅ Nunca expongas client secrets en el frontend
- ✅ Usa variables de entorno para credenciales
- ✅ Implementa CSRF protection (incluido en NextAuth)
- ✅ Valida tokens en el backend
- ✅ Usa HTTPS en producción

## 📚 Recursos Adicionales

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Nota:** La implementación actual está lista para recibir la lógica de autenticación. El botón de Google y toda la UI están preparados, solo falta conectar con el servicio de autenticación elegido.
