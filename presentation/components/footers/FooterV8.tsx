"use client";
import React, { useState } from "react";
import Image from "next/image";

const NAV_COLS = [
  {
    title: "Empresa",
    links: ["Sobre nosotros", "Cómo funciona", "Tarifas", "Blog"],
  },
  {
    title: "Soporte",
    links: ["Centro de ayuda", "Tracking", "WhatsApp"],
  },
  {
    title: "Legal",
    links: ["Términos", "Privacidad", "Cookies"],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.2.1-1.5.1-4.8.1s-3.6 0-4.8-.1C3.7 21.5 2.1 20 2 16.8 1.9 15.6 1.9 15.2 1.9 12s0-3.6.1-4.8C2.1 4 3.7 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zm0 1.8c-3.2 0-3.5 0-4.7.1-2.2.1-3.2 1.1-3.3 3.3C4 8.5 4 8.8 4 12s0 3.5.1 4.7c.1 2.2 1.1 3.2 3.3 3.3 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c2.2-.1 3.2-1.1 3.3-3.3.1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-2.2-1.1-3.2-3.3-3.3-1.2-.1-1.5-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8a3.2 3.2 0 1 0 0-6.3 3.2 3.2 0 0 0 0 6.3zm6.2-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0Z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h4l-9 11 10 13h-8l-6-8-7 8H1l10-12L1 0h8l5 7 5-7Z" />
      </svg>
    ),
  },
];

export default function FooterV8() {
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="fv8-footer">
        {/* BIG background wordmark */}
        <div className="fv8-wordmark" aria-hidden="true">SHIPAZO</div>

        <div className="fv8-grid">
          {/* Brand column */}
          <div>
            <div className="fv8-brand">
              <Image
                src="/images/logo/favicon-shipazo.webp"
                alt="Shipazo"
                width={32}
                height={32}
                style={{ borderRadius: 7 }}
              />
              <span className="fv8-brand-name">SHIPAZO</span>
            </div>
            <p className="fv8-blurb">
              Tu tienda global con envío automático a casa. Compra fácil, paga local, recibe tranquilo.
            </p>
            <div className="fv8-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} className="fv8-social" aria-label={s.label} href="#">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h5 className="fv8-col-title">{col.title}</h5>
              {col.links.map((link) => (
                <a key={link} className="fv8-link" href="#">{link}</a>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div className="fv8-newsletter">
            <h5 className="fv8-col-title" style={{ color: "white" }}>Boletín</h5>
            <p className="fv8-newsletter-sub">Ofertas exclusivas en tu correo.</p>
            <input
              className="fv8-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="fv8-subscribe" type="button">Suscribirme</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="fv8-bot">
          <span>© 2026 Shipazo · Lima, Perú</span>
          <span>Hecho con cariño en 🇵🇪</span>
        </div>
      </footer>

      <style>{`
        .fv8-footer {
          margin-top: 60px;
          padding: 80px 40px 40px;
          border-top: 1px solid rgba(255,255,255,0.12);
          position: relative;
          overflow: hidden;
        }

        /* Giant background wordmark */
        .fv8-wordmark {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(100px, 20vw, 280px);
          line-height: 0.8;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #562b7f 0%, #dc6f34 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0.15;
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
        }

        .fv8-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr) auto;
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        .fv8-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .fv8-brand-name {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          color: white;
          font-size: 18px;
          letter-spacing: -0.01em;
        }

        .fv8-blurb {
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 20px;
          max-width: 260px;
        }

        .fv8-socials { display: flex; gap: 10px; }

        .fv8-social {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .fv8-social:hover { background: #dc6f34; border-color: #dc6f34; }

        .fv8-col-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #f4a261;
          margin: 0 0 16px;
        }

        .fv8-link {
          display: block;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          padding: 6px 0;
          transition: color 0.15s;
        }
        .fv8-link:hover { color: white; }

        .fv8-newsletter {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 18px;
          min-width: 200px;
        }

        .fv8-newsletter-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          margin: 6px 0 0;
        }

        .fv8-input {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          padding: 10px 12px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          margin-top: 10px;
          transition: border-color 0.2s;
        }
        .fv8-input:focus { border-color: rgba(220,111,52,0.5); }
        .fv8-input::placeholder { color: rgba(255,255,255,0.4); }

        .fv8-subscribe {
          width: 100%;
          margin-top: 8px;
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
        }
        .fv8-subscribe:hover { opacity: 0.9; }

        .fv8-bot {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 80px auto 0;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.12);
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        @media (max-width: 1100px) {
          .fv8-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }
          .fv8-newsletter { min-width: unset; }
        }

        @media (max-width: 640px) {
          .fv8-footer { padding: 60px 20px 32px; }
          .fv8-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .fv8-bot { flex-direction: column; gap: 8px; }
          .fv8-wordmark { font-size: 80px; }
        }
      `}</style>
    </>
  );
}
