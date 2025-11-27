"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/application/stores/useAuthStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    // Obtener el accessToken de los query parameters
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      // Guardar el token en el store (y localStorage via persist)
      setAccessToken(accessToken);

      // Redirigir al home o dashboard
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } else {
      // Si no hay token, mostrar error
      setError("No se recibió el token de autenticación");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [searchParams, setAccessToken, router]);

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
