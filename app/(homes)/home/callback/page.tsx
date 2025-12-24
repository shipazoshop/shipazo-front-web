"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/application/stores/useAuthStore";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setAccessToken } = useAuthStore();

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
          document.cookie = `auth-storage=${encryptedStorage}; path=/; max-age=2592000; SameSite=Lax`;
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
      }, 100);
    } else {
      // Si no hay token, mostrar error
      setError("No se recibió el token de autenticación");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [searchParams, router, setAccessToken]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      {error ? (
        <>
          <div style={{ fontSize: "3rem" }}>❌</div>
          <h2 style={{ color: "#ef4444" }}>Error de autenticación</h2>
          <p>{error}</p>
          <p style={{ color: "#6b7280" }}>Redirigiendo al login...</p>
        </>
      ) : (
        <>
          <div className="loader" style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite"
          }} />
          <h2>Autenticación exitosa</h2>
          <p style={{ color: "#6b7280" }}>Redirigiendo...</p>
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div className="loader" style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite"
        }} />
        <p>Cargando...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
