import LoginForm from "@/presentation/components/auth/LoginForm";
import React, { Suspense } from "react";

export const metadata = {
  title: "Iniciar Sesión || shipazo - Multipurpose React Nextjs eCommerce",
  description: "Inicia sesión en shipazo con tu cuenta de Google",
};

// Esqueleto estático que replica la estructura visual del LoginForm.
// Al ser un Server Component sin JS, se pinta instantáneamente y evita
// el flash de "Cargando..." mientras React hidrata el LoginForm cliente.
function LoginSkeleton() {
  return (
    <div className="login-form-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{
              display: "inline-block",
              width: 120,
              height: 38,
              borderRadius: 8,
              background: "var(--color-gray-lightest)",
            }} />
          </div>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{
              display: "inline-block",
              width: "60%",
              height: 28,
              borderRadius: 6,
              background: "var(--color-gray-lightest)",
            }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              width: "80%",
              height: 16,
              borderRadius: 4,
              background: "var(--color-gray-lightest)",
            }} />
          </div>
        </div>
        <div className="login-content">
          <div style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            background: "var(--color-gray-lightest)",
            marginBottom: 32,
          }} />
          <div className="login-divider">
            <span className="divider-line" />
            <span className="divider-text">Inicio de sesión seguro</span>
            <span className="divider-line" />
          </div>
          <div className="login-info">
            {[1, 2].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--color-gray-lightest)", flexShrink: 0 }} />
                <span style={{ flex: 1, height: 14, borderRadius: 4, background: "var(--color-gray-lightest)" }} />
              </div>
            ))}
          </div>
        </div>
        <div className="login-footer">
          <div style={{ textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              width: "70%",
              height: 14,
              borderRadius: 4,
              background: "var(--color-gray-lightest)",
            }} />
          </div>
        </div>
      </div>
      <div className="login-bg-decoration">
        <div className="decoration-circle circle-1" />
        <div className="decoration-circle circle-2" />
        <div className="decoration-circle circle-3" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="tf-page-login">
      <div className="container-login">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <Suspense fallback={<LoginSkeleton />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
