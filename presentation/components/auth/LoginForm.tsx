"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthRepository } from "@/presentation/hooks/repositories/useAuthRepository";

const GOOGLE_SVG = (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.6 6.2 29.6 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.6 7.2 29.6 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.6C29.6 34.4 26.9 35 24 35c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.7 38.5 16.3 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.6 5.6C42.5 35.5 44 30 44 24c0-1.3-.2-2.3-.4-3.5z"/>
  </svg>
);

const TAGS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
    label: "Compra asegurada",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Tracking en tiempo real",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
      </svg>
    ),
    label: "Envío Express",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18a9 9 0 0 1 18 0" />
        <path d="M21 19a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" />
        <path d="M3 19a2 2 0 0 0 2 2h1v-6h-1a2 2 0 0 0-2 2z" />
      </svg>
    ),
    label: "Soporte 24/7",
  },
];

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" /><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
    cls: "trust-ico-orange",
    title: "Autenticación verificada con Google",
    desc: "Cero contraseñas, cero riesgos.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    cls: "trust-ico-purple",
    title: "Tus datos están cifrados",
    desc: "Conexión TLS y datos protegidos en cada compra.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    cls: "trust-ico-orange",
    title: "Acceso instantáneo",
    desc: "Entra en menos de 5 segundos. Tus pedidos te esperan.",
  },
];

const AVATARS = [
  { initial: "K", style: { background: "linear-gradient(135deg, #dc6f34, #f4a261)" } },
  { initial: "J", style: { background: "linear-gradient(135deg, #6a3a99, #562b7f)" } },
  { initial: "M", style: { background: "linear-gradient(135deg, #f4a261, #dc6f34)" } },
  { initial: "A", style: { background: "linear-gradient(135deg, #562b7f, #dc6f34)" } },
];

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleAuth } = useAuthRepository();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      sessionStorage.setItem("redirectAfterLogin", redirect);
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleAuth();
  };

  return (
    <>
      {/* ── Pitch (left) ── */}
      <section className="lv8-pitch">
        <span className="lv8-eyebrow">
          <span className="lv8-dot" />
          Tu tienda online global
        </span>

        <h1 className="lv8-h1">
          Pega un link.<br />
          <span className="lv8-acc">Recibe en casa.</span>
        </h1>

        <p className="lv8-lead">
          Inicia sesión para cotizar, comprar y rastrear tus pedidos del extranjero.
          Sin tarjetas internacionales, sin sorpresas.
        </p>

        <div className="lv8-tags">
          {TAGS.map((t) => (
            <span key={t.label} className="lv8-tag">
              <span className="lv8-tag-ico">{t.icon}</span>
              {t.label}
            </span>
          ))}
        </div>

        <div className="lv8-meta">
          <div className="lv8-avatars">
            {AVATARS.map((a) => (
              <span key={a.initial} className="lv8-avatar" style={a.style}>{a.initial}</span>
            ))}
          </div>
          <span>
            <b className="lv8-bold">+12,400</b>{" "}
            personas ya compran con nosotros
          </span>
        </div>
      </section>

      {/* ── Card (right) ── */}
      <section className="lv8-card-wrap">
        <div className="lv8-card">
          <div className="lv8-card-head">
            <div className="lv8-card-eyebrow">Acceso a tu cuenta</div>
            <h2 className="lv8-card-h2">
              Bienvenido<br />de nuevo.
            </h2>
            <p className="lv8-card-sub">
              Inicia sesión con tu cuenta de Google y continúa con tus pedidos.
            </p>
          </div>

          <button
            className="lv8-gbtn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <span className="lv8-gico">{GOOGLE_SVG}</span>
            <span>{isLoading ? "Iniciando sesión..." : "Continuar con Google"}</span>
            {!isLoading && (
              <svg className="lv8-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>

          <div className="lv8-divider">Inicio de sesión seguro</div>

          <ul className="lv8-trust">
            {TRUST_ITEMS.map((item) => (
              <li key={item.title} className="lv8-trust-item">
                <span className={`lv8-trust-ico ${item.cls}`}>{item.icon}</span>
                <div>
                  <b className="lv8-trust-title">{item.title}</b>
                  <small className="lv8-trust-desc">{item.desc}</small>
                </div>
              </li>
            ))}
          </ul>

          <p className="lv8-legal">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terms" className="lv8-link">Términos de Servicio</Link>
            {" "}y nuestra{" "}
            <Link href="/privacy" className="lv8-link">Política de Privacidad</Link>.
          </p>
        </div>

      </section>

      <style>{`
        /* ──────────────────────────────────────────────────────
           LEFT: Pitch
        ────────────────────────────────────────────────────── */
        .lv8-pitch {
          color: white;
        }

        .lv8-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(220,111,52,0.15);
          border: 1px solid rgba(220,111,52,0.35);
          color: #f4a261;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 999px;
        }

        .lv8-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #dc6f34;
          box-shadow: 0 0 12px #dc6f34;
          flex-shrink: 0;
          animation: lv8DotPulse 2s ease-in-out infinite;
        }

        @keyframes lv8DotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .lv8-h1 {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-size: 68px;
          line-height: 0.96;
          letter-spacing: -0.025em;
          font-weight: 900;
          margin: 22px 0 18px;
          color: white;
        }

        .lv8-acc {
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .lv8-lead {
          font-size: 17px;
          line-height: 1.55;
          color: rgba(255,255,255,0.7);
          max-width: 460px;
          margin: 0;
        }

        /* Tags */
        .lv8-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 30px;
          max-width: 480px;
        }

        .lv8-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.85);
          font-weight: 600;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .lv8-tag-ico {
          color: #f4a261;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Social proof */
        .lv8-meta {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }

        .lv8-avatars {
          display: inline-flex;
        }

        .lv8-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid #14071f;
          margin-left: -8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
        }

        .lv8-avatars .lv8-avatar:first-child {
          margin-left: 0;
        }

        .lv8-bold {
          color: white;
          font-weight: 700;
        }

        /* ──────────────────────────────────────────────────────
           RIGHT: Card
        ────────────────────────────────────────────────────── */
        .lv8-card-wrap {
          position: relative;
        }

        /* Glow behind the card */
        .lv8-card-wrap::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 28px;
          background: linear-gradient(135deg, #562b7f 0%, #dc6f34 100%);
          opacity: 0.55;
          filter: blur(28px);
          z-index: 0;
        }

        .lv8-card {
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, rgba(42,19,64,0.85) 0%, rgba(20,7,31,0.92) 100%);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 26px;
          padding: 40px;
          box-shadow:
            0 40px 80px -30px rgba(0,0,0,0.7),
            0 0 0 1px rgba(255,255,255,0.04) inset;
          overflow: hidden;
        }

        /* Orange glow inside top-right of card */
        .lv8-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 90% -10%, rgba(220,111,52,0.25), transparent 50%);
          pointer-events: none;
        }

        /* Card header */
        .lv8-card-head {
          position: relative;
        }

        .lv8-card-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f4a261;
        }

        .lv8-card-h2 {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-size: 38px;
          line-height: 1.05;
          letter-spacing: -0.015em;
          font-weight: 900;
          margin: 10px 0 8px;
          color: white;
        }

        .lv8-card-sub {
          font-size: 14.5px;
          color: rgba(255,255,255,0.65);
          margin: 0 0 28px;
          line-height: 1.5;
        }

        /* Google button */
        .lv8-gbtn {
          position: relative;
          width: 100%;
          padding: 16px 22px;
          border-radius: 14px;
          background: white;
          color: #1a0d24;
          border: 0;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 14px 30px -10px rgba(0,0,0,0.6);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }

        .lv8-gbtn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.7);
        }

        .lv8-gbtn:active:not(:disabled) {
          transform: translateY(0);
        }

        .lv8-gbtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .lv8-gico {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .lv8-arrow {
          margin-left: auto;
          opacity: 0.4;
          transition: opacity 0.2s, transform 0.2s;
          flex-shrink: 0;
        }

        .lv8-gbtn:hover .lv8-arrow {
          opacity: 1;
          transform: translateX(3px);
        }

        /* Divider */
        .lv8-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 26px 0 22px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        .lv8-divider::before,
        .lv8-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.12);
        }

        /* Trust list */
        .lv8-trust {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .lv8-trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.85);
        }

        .lv8-trust-ico {
          width: 36px;
          height: 36px;
          border-radius: 11px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .trust-ico-orange {
          background: rgba(220,111,52,0.18);
          color: #f4a261;
          border: 1px solid rgba(220,111,52,0.32);
        }

        .trust-ico-purple {
          background: rgba(106,58,153,0.28);
          color: #c9a3f0;
          border: 1px solid rgba(106,58,153,0.45);
        }

        .lv8-trust-title {
          display: block;
          color: white;
          font-weight: 700;
        }

        .lv8-trust-desc {
          display: block;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          margin-top: 2px;
          font-weight: 500;
        }

        /* Legal */
        .lv8-legal {
          margin: 28px 0 0;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.12);
          font-size: 12.5px;
          line-height: 1.55;
          color: rgba(255,255,255,0.55);
          text-align: center;
        }

        .lv8-link {
          color: #f4a261;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s;
        }

        .lv8-link:hover {
          color: #ff8a4a;
          text-decoration: underline;
        }

        /* ──────────────────────────────────────────────────────
           RESPONSIVE: tablet stacks, mobile hides pitch
        ────────────────────────────────────────────────────── */
        @media (max-width: 960px) {
          .lv8-h1 { font-size: 48px; }
          .lv8-lead { font-size: 15.5px; }
          .lv8-card { padding: 30px 24px; }
          .lv8-card-h2 { font-size: 30px; }
          .lv8-floater {
            left: 50%;
            transform: translateX(-50%);
            bottom: -18px;
          }
        }

        /* Mobile: hide the pitch entirely */
        @media (max-width: 768px) {
          .lv8-pitch { display: none; }
          .lv8-floater { display: none; }
        }
      `}</style>
    </>
  );
};

export default LoginForm;
