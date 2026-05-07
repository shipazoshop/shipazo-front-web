"use client";
import React from "react";

const STEPS = [
  {
    num: "01",
    cls: "s1",
    title: "COPIA",
    desc: "Busca tu producto favorito en cualquier tienda del mundo y copia el link de compra.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  {
    num: "02",
    cls: "s2",
    title: "PEGA",
    desc: "Pégalo en nuestro buscador inteligente y obtén el precio total al instante.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    num: "03",
    cls: "s3",
    title: "COMPRA",
    desc: "Confirma tu orden y paga seguro en soles. Nosotros gestionamos la compra.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    num: "04",
    cls: "s4",
    title: "RECIBE",
    desc: "Te lo entregamos en tu puerta con tracking en tiempo real desde la app.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
        <path d="M5 17h-2v-11a1 1 0 0 1 1-1h9v12m-3 0h6m4 0h2v-6h-8m0-5 5 5" />
      </svg>
    ),
  },
];

export default function HowItWorksV8() {
  return (
    <>
      <section className="hv8-how">
        <div className="hv8-section-head">
          <div className="hv8-section-eyebrow">Tres pasos · Cero complicaciones</div>
          <h2 className="hv8-section-title">¿Cómo funciona?</h2>
          <p className="hv8-section-sub">Tu proceso de compra internacional, simplificado en pasos digitales.</p>
        </div>

        <div className="hv8-steps">
          {STEPS.map((step) => (
            <div key={step.num} className={`hv8-step ${step.cls}`}>
              <span className="hv8-step-num">{step.num}</span>
              <div className={`hv8-step-ico ${step.cls}`}>{step.icon}</div>
              <div>
                <h3 className="hv8-step-title">{step.title}</h3>
                <p className="hv8-step-desc">{step.desc}</p>
              </div>
              <span className="hv8-step-arrow">
                Paso {step.num}
                <span className="hv8-step-line" />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .hv8-how {
          padding: 60px 40px 80px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .hv8-section-head {
          text-align: center;
          margin-bottom: 48px;
        }

        .hv8-section-eyebrow {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f4a261;
          margin-bottom: 12px;
        }

        .hv8-section-title {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0 0 14px;
          color: white;
        }

        .hv8-section-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          max-width: 560px;
          margin: 0 auto;
        }

        .hv8-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .hv8-step {
          position: relative;
          border-radius: 24px;
          padding: 28px;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
          transition: transform 0.3s, background 0.3s, border-color 0.3s;
        }

        .hv8-step:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
        }

        /* Left colour bar */
        .hv8-step::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          border-radius: 24px 0 0 24px;
        }
        .hv8-step.s1::before { background: #dc6f34; }
        .hv8-step.s2::before { background: #6a3a99; }
        .hv8-step.s3::before { background: linear-gradient(135deg, #dc6f34, #f4a261); }
        .hv8-step.s4::before { background: linear-gradient(135deg, #562b7f, #dc6f34); }

        .hv8-step-num {
          position: absolute;
          top: 18px; right: 22px;
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 56px;
          line-height: 1;
          color: rgba(255,255,255,0.08);
          pointer-events: none;
        }

        .hv8-step-ico {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          margin-bottom: 4px;
        }
        .hv8-step-ico.s1 { background: rgba(220,111,52,0.18); border-color: rgba(220,111,52,0.35); color: #f4a261; }
        .hv8-step-ico.s2 { background: rgba(106,58,153,0.25); border-color: rgba(106,58,153,0.45); color: #c9a3f0; }
        .hv8-step-ico.s3 { background: rgba(220,111,52,0.18); border-color: rgba(220,111,52,0.35); color: #f4a261; }
        .hv8-step-ico.s4 { background: rgba(106,58,153,0.25); border-color: rgba(106,58,153,0.45); color: #c9a3f0; }

        .hv8-step-title {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 28px;
          letter-spacing: 0.02em;
          margin: 8px 0 8px;
          color: white;
        }

        .hv8-step-desc {
          font-size: 13.5px;
          line-height: 1.55;
          margin: 0;
          color: rgba(255,255,255,0.7);
        }

        .hv8-step-arrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-top: 8px;
        }

        .hv8-step-line {
          width: 24px;
          height: 1px;
          background: rgba(255,255,255,0.35);
          flex-shrink: 0;
        }

        @media (max-width: 1100px) {
          .hv8-steps { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .hv8-how { padding: 40px 20px 60px; }
          .hv8-steps { grid-template-columns: 1fr; }
          .hv8-step { min-height: 220px; }
        }
      `}</style>
    </>
  );
}
