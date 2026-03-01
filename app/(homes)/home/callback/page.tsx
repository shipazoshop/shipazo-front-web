"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/application/stores/useAuthStore";
import Image from "next/image";

// Estilos de animaciones inyectados en <head> via una etiqueta global,
// así están disponibles antes del primer paint sin depender de CSS-in-JS.
const GLOBAL_STYLES = `
  @keyframes cb-slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cb-pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.04); }
  }
  @keyframes cb-bounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40%           { transform: scale(1);   opacity: 1; }
  }
  .cb-screen   { display:flex; align-items:center; justify-content:center; min-height:100vh; background-color:#ea4d30; opacity:0; transition:opacity 0.5s ease; }
  .cb-screen.cb-in { opacity:1; }
  .cb-content  { display:flex; flex-direction:column; align-items:center; gap:1.5rem; animation:cb-slideUp 0.6s ease 0.15s both; }
  .cb-logo-wrap{ animation:cb-pulse 2s ease-in-out infinite; }
  .cb-logo     { object-fit:contain; }
  .cb-title    { color:#fff; font-family:var(--font-poppins),"Poppins",sans-serif; font-size:1.75rem; font-weight:600; margin:0; letter-spacing:-0.01em; text-align:center; }
  .cb-subtitle { color:rgba(255,255,255,.85); font-family:var(--font-inter),"Inter",sans-serif; font-size:1rem; margin:0; text-align:center; }
  .cb-hint     { color:rgba(255,255,255,.65); font-family:var(--font-inter),"Inter",sans-serif; font-size:.875rem; margin:0; }
  .cb-err-icon { font-size:3rem; color:#fff; font-weight:700; line-height:1; background:rgba(255,255,255,.2); width:72px; height:72px; display:flex; align-items:center; justify-content:center; border-radius:50%; }
  .cb-dots     { display:flex; gap:.5rem; align-items:center; }
  .cb-dots span{ width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.7); animation:cb-bounce 1.2s ease-in-out infinite; }
  .cb-dots span:nth-child(2){ animation-delay:.2s; }
  .cb-dots span:nth-child(3){ animation-delay:.4s; }
`;

function InjectStyles() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />;
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    // rAF garantiza que el browser ya pintó el fondo naranja antes del fade-in
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      setAccessToken(accessToken);

      // Sincronizar localStorage con cookies después de un breve delay
      // para asegurar que Zustand persist haya terminado de guardar
      setTimeout(() => {
        const encryptedStorage = localStorage.getItem('auth-storage');
        if (encryptedStorage) {
          // Copiar el storage encriptado a las cookies
          const isHttps = globalThis.location?.protocol === 'https:';
          document.cookie = `auth-storage=${encryptedStorage}; path=/; max-age=2592000; SameSite=Lax${isHttps ? '; Secure' : ''}`;
        }

        // Limpiar la URL
        globalThis.history.replaceState({}, '', '/callback');

        // Verificar si hay una URL de redirección guardada
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

        if (redirectUrl) {
          // Limpiar el sessionStorage y redirigir a la URL guardada
          sessionStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl);
        } else {
          // Redirección por defecto
          router.push("/home");
        }
      }, 1800);
    } else {
      // Si no hay token, mostrar error
      setError("No se recibió el token de autenticación");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [searchParams, router, setAccessToken]);

  return (
    <>
      <InjectStyles />
      <div className={`cb-screen${visible ? ' cb-in' : ''}`}>
        {error ? (
          <div className="cb-content">
            <div className="cb-err-icon">✕</div>
            <h2 className="cb-title">Error de autenticación</h2>
            <p className="cb-subtitle">{error}</p>
            <p className="cb-hint">Redirigiendo al login...</p>
          </div>
        ) : (
          <div className="cb-content">
            <div className="cb-logo-wrap">
              <Image
                src="/images/logo/shipazo-white.png"
                alt="Shipazo"
                width={220}
                height={80}
                className="cb-logo"
                priority
              />
            </div>
            <h2 className="cb-title">¡Autenticación exitosa!</h2>
            <div className="cb-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function CallbackFallback() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#ea4d30",
    }}>
      <Image
        src="/images/logo/shipazo-white.png"
        alt="Shipazo"
        width={180}
        height={65}
        style={{ objectFit: "contain", opacity: 0.9 }}
        priority
      />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
