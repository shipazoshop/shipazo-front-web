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

export default function FooterLight() {
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="fl-footer">
        {/* BIG background wordmark */}
        <div className="fl-wordmark" aria-hidden="true">SHIPAZO</div>

        <div className="fl-grid">
          {/* Brand column */}
          <div>
            <div className="fl-brand">
              <Image
                src="/images/logo/favicon-shipazo.webp"
                alt="Shipazo"
                width={32}
                height={32}
                style={{ borderRadius: 7 }}
              />
              <span className="fl-brand-name">SHIPAZO</span>
            </div>
            <p className="fl-blurb">
              Tu tienda global con envío automático a casa. Compra fácil, paga local, recibe tranquilo.
            </p>
            <div className="fl-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} className="fl-social" aria-label={s.label} href="#">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h5 className="fl-col-title">{col.title}</h5>
              {col.links.map((link) => (
                <a key={link} className="fl-link" href="#">{link}</a>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div className="fl-newsletter">
            <h5 className="fl-newsletter-title">Boletín</h5>
            <p className="fl-newsletter-sub">Ofertas exclusivas en tu correo.</p>
            <input
              className="fl-input"
              type="email"
              placeholder="tu@email.com"
              aria-label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="fl-subscribe" type="button">Suscribirme</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="fl-bot">
          <span>© 2026 Shipazo · Guatemala</span>
          <span>Hecho con cariño en 🇬🇹</span>
        </div>
      </footer>

      <style>{`
        .fl-footer {
          margin-top: 60px;
          padding: 80px 40px 40px;
          border-top: 1px solid #ECE5DC;
          position: relative;
          overflow: hidden;
          background: #FAF7F2;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Giant background wordmark — subtle on light */
        .fl-wordmark {
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
          opacity: 0.07;
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
        }

        .fl-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr) auto;
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        .fl-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .fl-brand-name {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          color: #1A0D24;
          font-size: 18px;
          letter-spacing: -0.01em;
        }

        .fl-blurb {
          color: #4A3D57;
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 20px;
          max-width: 260px;
        }

        .fl-socials { display: flex; gap: 10px; }

        .fl-social {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #ECE5DC;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #4A3D57;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          text-decoration: none;
        }
        .fl-social:hover { background: #dc6f34; border-color: #dc6f34; color: #fff; }

        .fl-col-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #DC6F34;
          margin: 0 0 16px;
        }

        .fl-link {
          display: block;
          color: #4A3D57;
          text-decoration: none;
          font-size: 14px;
          padding: 6px 0;
          transition: color 0.15s;
        }
        .fl-link:hover { color: #1A0D24; }

        .fl-newsletter {
          background: #fff;
          border: 1px solid #ECE5DC;
          border-radius: 16px;
          padding: 18px;
          min-width: 200px;
          box-shadow: 0 10px 30px -18px rgba(20,7,31,0.18);
        }

        .fl-newsletter-title {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: none;
          color: #1A0D24;
        }

        .fl-newsletter-sub {
          font-size: 12px;
          color: #8A7D96;
          margin: 6px 0 0;
          line-height: 1.45;
        }

        .fl-input {
          width: 100%;
          background: #FAF7F2;
          border: 1.5px solid #ECE5DC;
          color: #1A0D24;
          padding: 10px 12px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          margin-top: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fl-input:focus { border-color: #DC6F34; box-shadow: 0 0 0 3px rgba(220,111,52,0.12); }
        .fl-input::placeholder { color: #8A7D96; }

        .fl-subscribe {
          width: 100%;
          margin-top: 8px;
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          border: none;
          color: white;
          padding: 11px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 8px 18px -8px rgba(220,111,52,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .fl-subscribe:hover { transform: translateY(-1px); box-shadow: 0 12px 22px -8px rgba(220,111,52,0.55); }

        .fl-bot {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 80px auto 0;
          padding-top: 24px;
          border-top: 1px solid #ECE5DC;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #8A7D96;
        }

        @media (max-width: 1100px) {
          .fl-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }
          .fl-newsletter { min-width: unset; }
        }

        @media (max-width: 900px) {
          .fl-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .fl-newsletter { grid-column: 1 / -1; }
          .fl-wordmark { font-size: 150px; bottom: -20px; }
          .fl-bot { flex-direction: column; gap: 10px; text-align: center; }
        }

        @media (max-width: 640px) {
          .fl-footer { padding: 60px 20px 32px; }
          .fl-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .fl-wordmark { font-size: 80px; }
        }
      `}</style>
    </>
  );
}
