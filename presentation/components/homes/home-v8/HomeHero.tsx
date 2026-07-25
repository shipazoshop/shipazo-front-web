"use client";
import React from "react";
import SearchBarV8 from "../../common/SearchBarV8";
import HeroBrandsCarousel from "./HeroBrandsCarousel";

export default function HomeHero() {
  return (
    <>
      <div className="hv8-hero-wrap">
        {/* Fondo: carrusel diagonal de marcas + capa oscura (detrás del contenido) */}
        <HeroBrandsCarousel />

        <section className="hv8-hero">
        {/* Eyebrow */}
        <div className="hv8-eyebrow">
          <span className="hv8-eyebrow-dot" />
          Tu tienda online global · Envíos a Guatemala
        </div>

        {/* Headline */}
        <h1 className="hv8-h1">
          Pega un link.<br />
          <span className="hv8-h1-acc">Recibe en casa.</span>
        </h1>

        {/* Subtitle */}
        <p className="hv8-hero-sub">
          Compra cualquier producto del extranjero en segundos. Cotizamos, compramos y enviamos por ti — sin tarjetas internacionales, sin sorpresas.
        </p>

        {/* Search bar */}
        <div className="hv8-hero-search">
          <SearchBarV8 />
        </div>

        {/* Social proof */}
        <div className="hv8-hero-meta">
          <div className="hv8-avatars" aria-hidden="true">
            <span style={{ background: "linear-gradient(135deg, #dc6f34, #f4a261)" }}>K</span>
            <span style={{ background: "linear-gradient(135deg, var(--color-brand-purple), var(--color-brand-purple-dark))" }}>J</span>
            <span style={{ background: "linear-gradient(135deg, #f4a261, #dc6f34)" }}>M</span>
            <span style={{ background: "linear-gradient(135deg, var(--color-brand-purple-dark), #dc6f34)" }}>A</span>
          </div>
          <span>
            <strong style={{ color: "white" }}>+12,400</strong> personas ya compran con nosotros
          </span>
          </div>
        </section>
      </div>

      <style>{`
        .hv8-hero-wrap {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          /* Espacio extra debajo del contenido para que el carrusel de fondo
             y su desvanecido terminen por debajo del texto (no en la última línea) */
          padding-bottom: 160px;
        }

        .hv8-hero {
          position: relative;
          z-index: 2;
          padding: 80px 40px 60px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .hv8-eyebrow {
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
          margin-bottom: 22px;
        }

        .hv8-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #dc6f34;
          box-shadow: 0 0 12px #dc6f34;
          flex-shrink: 0;
        }

        .hv8-h1 {
          font-family: var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.025em;
          margin: 0 0 18px;
          color: white;
        }

        .hv8-h1-acc {
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hv8-hero-sub {
          font-size: 18px;
          line-height: 1.55;
          color: rgba(255,255,255,0.7);
          max-width: 620px;
          margin: 0 0 36px;
        }

        .hv8-hero-search {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .hv8-hero-meta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }

        .hv8-avatars {
          display: inline-flex;
        }

        .hv8-avatars span {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--color-brand-purple-darkest);
          margin-left: -8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
        }

        .hv8-avatars span:first-child { margin-left: 0; }

        @media (max-width: 768px) {
          .hv8-hero-wrap {
            padding-bottom: 120px;
          }
          .hv8-hero {
            padding: 60px 20px 40px;
          }
          .hv8-hero-sub {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .hv8-hero-wrap {
            padding-bottom: 90px;
          }
          .hv8-hero {
            padding: 48px 16px 32px;
          }
          .hv8-hero-sub {
            font-size: 15px;
          }
          .hv8-hero-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}
