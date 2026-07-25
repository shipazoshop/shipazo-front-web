"use client";
import React, { useEffect, useRef } from "react";

/**
 * Fondo del hero: muro de posters diagonal de marcas con parallax + deriva lenta.
 * Decorativo (aria-hidden). Va DETRÁS del contenido del hero.
 * Handoff: "Fondo dinámico buscador marcas".
 */

interface HeroBrand {
  name: string;
  img: string;
  logo: string;
}

// Data-driven: agregar marcas nuevas = editar esta lista.
const HERO_BRANDS: HeroBrand[] = [
  { name: "Amazon", img: "/images/brands/amazon/1.jpg", logo: "/images/brand/amazon-white.png" },
  { name: "Nike", img: "/images/brands/nike/1.png", logo: "/images/brand/nike-white.png" },
  { name: "Sephora", img: "/images/brands/sephora/1.webp", logo: "/images/brand/sephora-white.png" },
  { name: "Target", img: "/images/brands/target/1.webp", logo: "/images/brand/target-white.png" },
  { name: "Victoria's Secret", img: "/images/brands/vs/1.webp", logo: "/images/brand/victorias-secret-white.png" },
];

// 6 columnas (desktop). Tablet muestra 5, móvil 4 (vía CSS). Cada una con
// velocidad y dirección distinta para un movimiento orgánico.
const COLUMNS = [
  { dur: "54s", reverse: true },
  { dur: "66s", reverse: false },
  { dur: "60s", reverse: true },
  { dur: "72s", reverse: false },
  { dur: "58s", reverse: true },
  { dur: "64s", reverse: false },
];

// Rota el array para que cada columna empiece con una marca distinta, y lo
// duplica: la animación mueve translateY 0 → -50%, así el segundo set queda en
// la posición del primero (loop sin salto).
function columnCards(colIndex: number): HeroBrand[] {
  const rotated = HERO_BRANDS.map((_, i) => HERO_BRANDS[(i + colIndex) % HERO_BRANDS.length]);
  return [...rotated, ...rotated];
}

export default function HeroBrandsCarousel() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respetar reduce-motion: sin parallax por mouse.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let tx = 0;
    let ty = 0;
    let raf: number | null = null;

    const apply = () => {
      const el = parallaxRef.current;
      if (el) {
        const w = window.innerWidth;
        const depth = w <= 480 ? 14 : w <= 768 ? 18 : 22;
        el.style.transform = `translate3d(${(-tx * depth).toFixed(1)}px, ${(-ty * depth).toFixed(1)}px, 0)`;
      }
      raf = null;
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 .. 1
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="hbx-bg" aria-hidden="true">
        <div className="hbx-parallax" ref={parallaxRef}>
          <div className="hbx-tilt">
            {COLUMNS.map((col, ci) => (
              <div
                key={ci}
                className={`hbx-col${col.reverse ? " hbx-col--rev" : ""}`}
                style={{ "--dur": col.dur } as React.CSSProperties}
              >
                {columnCards(ci).map((brand, i) => (
                  <div className="hbx-card" key={`${brand.name}-${i}`}>
                    <div
                      className="hbx-img"
                      style={{ backgroundImage: `url(${brand.img})` }}
                    />
                    <div className="hbx-veil" />
                    <div className="hbx-logo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.logo} alt="" draggable={false} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hbx-scrim" aria-hidden="true" />

      <style>{`
        .hbx-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.5;
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 90%);
                  mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 90%);
        }

        .hbx-parallax {
          position: absolute;
          inset: -16%;
          will-change: transform;
        }

        .hbx-tilt {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          gap: 20px;
          transform: rotate(-11deg) scale(1.58);
          transform-origin: center;
        }

        .hbx-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: hbxScroll var(--dur, 60s) linear infinite;
        }
        .hbx-col--rev {
          animation-name: hbxScrollRev;
        }

        .hbx-card {
          position: relative;
          flex: none;
          width: 150px;
          height: 214px;
          border-radius: 13px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 14px 34px rgba(0,0,0,0.4);
          background: linear-gradient(155deg, rgba(64,30,74,0.92), rgba(120,58,52,0.85));
        }

        .hbx-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }

        .hbx-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%);
        }

        .hbx-logo {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
        }
        .hbx-logo img {
          max-width: 78%;
          max-height: 44px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.95;
        }

        @keyframes hbxScroll {
          to { transform: translateY(-50%); }
        }
        @keyframes hbxScrollRev {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }

        /* Capa oscura para legibilidad (también se desvanece abajo) */
        .hbx-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(66% 58% at 50% 50%, rgba(18,7,24,0.6), rgba(18,7,24,0.05) 70%);
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 90%);
                  mask-image: linear-gradient(to bottom, #000 0%, #000 58%, transparent 90%);
        }

        /* Tablet: 5 columnas */
        @media (max-width: 768px) {
          .hbx-bg { opacity: 0.48; }
          .hbx-parallax { inset: -18%; }
          .hbx-tilt { gap: 16px; transform: rotate(-12deg) scale(1.7); }
          .hbx-card { width: 124px; height: 176px; }
          .hbx-col:nth-child(6) { display: none; }
        }

        /* Móvil: 4 columnas */
        @media (max-width: 480px) {
          .hbx-bg { opacity: 0.46; }
          .hbx-parallax { inset: -22%; }
          .hbx-tilt { gap: 12px; transform: rotate(-13deg) scale(1.9); }
          .hbx-card { width: 100px; height: 142px; }
          .hbx-col:nth-child(n+5) { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hbx-col { animation: none; }
        }
      `}</style>
    </>
  );
}
