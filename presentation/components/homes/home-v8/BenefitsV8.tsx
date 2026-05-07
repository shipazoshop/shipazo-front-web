"use client";
import React from "react";

const BENEFITS = [
  {
    ico: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
      </svg>
    ),
    title: "Envío Express",
    desc: "Tus compras cruzan el mundo en tiempo récord gracias a nuestras rutas optimizadas.",
    accent: "orange",
  },
  {
    ico: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Seguimiento Real",
    desc: "Monitorea cada paso de tu pedido con precisión en tiempo real, desde la app.",
    accent: "purple",
  },
  {
    ico: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
    title: "Compra Asegurada",
    desc: "Protección completa contra cualquier imprevisto durante el envío internacional.",
    accent: "orange",
  },
  {
    ico: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 18a9 9 0 0 1 18 0" />
        <path d="M21 19a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" />
        <path d="M3 19a2 2 0 0 0 2 2h1v-6h-1a2 2 0 0 0-2 2z" />
      </svg>
    ),
    title: "Soporte 24/7",
    desc: "Asistencia personalizada en tu idioma para resolver cualquier duda al instante.",
    accent: "purple",
  },
];

const CHECKS = [
  "Sin tarjetas internacionales ni complicaciones",
  "Precio total claro: producto, envío y aduanas",
  "Notificaciones por WhatsApp y email",
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export default function BenefitsV8() {
  return (
    <>
      <section className="benv8-section">
        {/* 2×2 benefit cards */}
        <div className="benv8-grid">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className={`benv8-card${i % 2 === 1 ? " offset" : ""}`}>
              <div className={`benv8-ico ${b.accent}`}>{b.ico}</div>
              <h4 className="benv8-card-title">{b.title}</h4>
              <p className="benv8-card-desc">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Right copy */}
        <div className="benv8-copy">
          <div className="hv8-section-eyebrow" style={{ textAlign: "left", marginBottom: 14 }}>
            Tu ventaja competitiva
          </div>
          <h2 className="benv8-h2">
            Tu tienda <span className="benv8-acc">global,</span>
            <br />sin fronteras.
          </h2>
          <p className="benv8-p">
            Eliminamos las barreras del comercio internacional. Comprar en cualquier parte del mundo es tan fácil como comprar en la tienda de la esquina.
          </p>
          <ul className="benv8-list">
            {CHECKS.map((c) => (
              <li key={c} className="benv8-li">
                <span className="benv8-check"><CheckIcon /></span>
                {c}
              </li>
            ))}
          </ul>
          <a href="#" className="benv8-cta">
            Comienza ahora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      <style>{`
        .benv8-section {
          padding: 80px 40px;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 56px;
          align-items: center;
        }

        .benv8-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .benv8-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.3s, background 0.3s;
        }

        .benv8-card:hover { background: rgba(255,255,255,0.09); }

        .benv8-card.offset {
          transform: translateY(20px);
        }
        .benv8-card.offset:hover {
          transform: translateY(17px);
        }

        .benv8-ico {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .benv8-ico.orange {
          background: rgba(220,111,52,0.18);
          color: #f4a261;
          border: 1px solid rgba(220,111,52,0.3);
        }
        .benv8-ico.purple {
          background: rgba(106,58,153,0.25);
          color: #c9a3f0;
          border: 1px solid rgba(106,58,153,0.4);
        }

        .benv8-card-title {
          font-size: 17px;
          font-weight: 800;
          margin: 0 0 8px;
          color: white;
        }

        .benv8-card-desc {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255,255,255,0.65);
          margin: 0;
        }

        /* Copy side */
        .benv8-h2 {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0 0 18px;
          color: white;
        }

        .benv8-acc {
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .benv8-p {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }

        .benv8-list {
          list-style: none;
          padding: 0;
          margin: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .benv8-li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: rgba(255,255,255,0.85);
        }

        .benv8-check {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(220,111,52,0.2);
          color: #f4a261;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(220,111,52,0.35);
        }

        .benv8-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          color: white;
          border-radius: 999px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 12px 30px -10px rgba(220,111,52,0.6);
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .benv8-cta:hover { opacity: 0.9; transform: translateY(-1px); color: white; }

        @media (max-width: 900px) {
          .benv8-section {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 60px 20px;
          }
          .benv8-card.offset { transform: none; }
          .benv8-card.offset:hover { transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}
