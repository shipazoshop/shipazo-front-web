"use client";
import React from "react";

export default function TrustBandV8() {
  return (
    <>
      <section className="hv8-trust">
        {/* 4 grid cells — glow is a CSS ::after pseudo-element, not a DOM node */}

        {/* Cell 1: Copy */}
        <div>
          <h2 className="hv8-trust-h2">Confianza en cada compra</h2>
          <p className="hv8-trust-p">
            Cada pedido pasa por verificación, seguro y seguimiento en tiempo real.
            Compras tranquilo, recibes tranquilo.
          </p>
        </div>

        {/* Cell 2: Ring */}
        <div className="hv8-trust-ring">
          <svg viewBox="0 0 100 100" width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
            <circle
              cx="50" cy="50" r="42"
              stroke="url(#hv8-ring-grad)"
              strokeWidth="6"
              fill="none"
              strokeDasharray="264"
              strokeDashoffset="2.6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="hv8-ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dc6f34" />
                <stop offset="100%" stopColor="#f4a261" />
              </linearGradient>
            </defs>
          </svg>
          <div className="hv8-trust-pct">
            99%
            <small>compras a tiempo</small>
          </div>
        </div>

        {/* Cell 3: Stat 1 */}
        <div className="hv8-trust-stat">
          <div className="hv8-trust-n">+12,400</div>
          <div className="hv8-trust-l">Compras entregadas</div>
        </div>

        {/* Cell 4: Stat 2 */}
        <div className="hv8-trust-stat">
          <div className="hv8-trust-n">4.9★</div>
          <div className="hv8-trust-l">Reseñas reales</div>
        </div>
      </section>

      <style>{`
        .hv8-trust {
          max-width: 1280px;
          margin: 40px auto 0;
          background: linear-gradient(135deg, rgba(20,7,31,0.7), rgba(42,19,64,0.6));
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 28px;
          padding: 48px 56px;
          display: grid;
          grid-template-columns: 1.4fr auto 1fr 1fr;
          gap: 40px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        /* Decorative glow — pure CSS, no DOM node in the grid */
        .hv8-trust::after {
          content: '';
          position: absolute;
          right: -100px; top: -100px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(220,111,52,0.25), transparent 70%);
          pointer-events: none;
        }

        .hv8-trust > * { position: relative; z-index: 1; }

        .hv8-trust-h2 {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(24px, 3vw, 38px);
          line-height: 1;
          margin: 0 0 12px;
          color: white;
        }

        .hv8-trust-p {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          margin: 0;
          line-height: 1.5;
        }

        .hv8-trust-ring {
          width: 130px; height: 130px;
          position: relative;
          flex-shrink: 0;
        }

        .hv8-trust-pct {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 28px;
          color: white;
          line-height: 1;
        }

        .hv8-trust-pct small {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.6);
          margin-top: 4px;
          text-transform: uppercase;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .hv8-trust-stat { text-align: left; }

        .hv8-trust-n {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 3.5vw, 42px);
          line-height: 1;
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hv8-trust-l {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 6px;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .hv8-trust {
            grid-template-columns: 1fr 1fr;
            padding: 36px 32px;
            gap: 28px;
          }
        }

        @media (max-width: 580px) {
          .hv8-trust {
            grid-template-columns: 1fr;
            padding: 28px 24px;
            gap: 20px;
            margin: 40px 20px 0;
          }
          .hv8-trust-ring { margin: 0 auto; }
        }
      `}</style>
    </>
  );
}
