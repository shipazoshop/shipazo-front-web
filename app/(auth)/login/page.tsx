import LoginForm from "@/presentation/components/auth/LoginForm";
import HomeBackground from "@/presentation/components/homes/home-v8/HomeBackground";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense } from "react";

export const metadata = {
  title: "Iniciar Sesión || Shipazo",
  description: "Inicia sesión en Shipazo con tu cuenta de Google",
};

function LoginSkeleton() {
  return (
    <section className="lv8-card-wrap">
      <div className="lv8-card">
        <div style={{ marginBottom: 28 }}>
          <span style={{ display: "block", width: 130, height: 11, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginBottom: 12 }} />
          <span style={{ display: "block", width: "65%", height: 38, borderRadius: 6, background: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
          <span style={{ display: "block", width: "80%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.07)" }} />
        </div>
        <div style={{ width: "100%", height: 54, borderRadius: 14, background: "rgba(255,255,255,0.15)", marginBottom: 26 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ width: 140, height: 11, borderRadius: 4, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <span style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", width: "55%", height: 13, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
              <span style={{ display: "block", width: "75%", height: 11, borderRadius: 4, background: "rgba(255,255,255,0.07)" }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
          <span style={{ display: "inline-block", width: "70%", height: 12, borderRadius: 4, background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <>
      <HomeBackground />

      <div className="lv8-page">
        {/* ── Nav ── */}
        <nav className="lv8-nav">
          <Link href="/home" className="lv8-logo-mark">
            <Image
              src="/images/logo/favicon-shipazo.webp"
              alt="Shipazo"
              width={36}
              height={36}
              style={{ borderRadius: 8 }}
            />
            <span className="lv8-logo-word">SHIPAZO</span>
          </Link>
          <Link href="/home" className="lv8-nav-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver al inicio
          </Link>
        </nav>

        {/* ── Stage: pitch + card ── */}
        <main className="lv8-stage">
          <Suspense fallback={<LoginSkeleton />}>
            <LoginForm />
          </Suspense>
        </main>

        {/* ── Footer ── */}
        <footer className="lv8-foot">
          <span>© 2026 Shipazo · Tu tienda global con envío a casa</span>
          <div className="lv8-foot-links">
            <Link href="/terms">Términos</Link>
            <Link href="/privacy">Privacidad</Link>
            <a href="#">Soporte</a>
          </div>
        </footer>
      </div>

      <style>{`
        /* Page shell */
        .lv8-page {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Nav */
        .lv8-nav {
          height: 72px;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(20,7,31,0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        .lv8-logo-mark {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .lv8-logo-word {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          color: white;
          font-size: 22px;
          letter-spacing: -0.01em;
        }

        .lv8-nav-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          transition: background 0.2s, color 0.2s;
        }

        .lv8-nav-back:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        /* Stage */
        .lv8-stage {
          flex: 1;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 64px 40px;
          gap: 64px;
          align-items: center;
        }

        /* Footer */
        .lv8-foot {
          padding: 24px 40px;
          border-top: 1px solid rgba(255,255,255,0.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          background: rgba(20,7,31,0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          flex-shrink: 0;
        }

        .lv8-foot-links {
          display: flex;
          gap: 22px;
        }

        .lv8-foot-links a,
        .lv8-foot a {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.15s;
        }

        .lv8-foot-links a:hover,
        .lv8-foot a:hover {
          color: white;
        }

        /* Responsive: tablet — stack columns */
        @media (max-width: 960px) {
          .lv8-stage {
            grid-template-columns: 1fr;
            padding: 36px 22px;
            gap: 40px;
          }
          .lv8-nav { padding: 0 20px; }
          .lv8-foot { flex-direction: column; gap: 10px; padding: 20px; text-align: center; }
        }

        /* Mobile: hide nav "Volver" button, show only logo; pitch already hidden via LoginForm CSS */
        @media (max-width: 768px) {
          .lv8-nav-back { display: none; }
          .lv8-stage { padding: 24px 20px 60px; }
        }
      `}</style>
    </>
  );
}
