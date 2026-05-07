"use client";
import React, { useEffect, useState } from "react";

interface BrandItem {
  name: string;
  tint: string;
  img1: string;
  img2: string;
  label: string;
  logoSrc: string;
  link: string;
}

const BRANDS: BrandItem[] = [
  {
    name: "Amazon",
    tint: "rgba(255,153,0,0.45)",
    img1: "/images/brands/amazon/1.jpg",
    img2: "/images/brands/amazon/2.jpg",
    label: "Amazon · US",
    logoSrc: "/images/brand/amazon-white.png",
    link: "https://www.amazon.com/",
  },
  {
    name: "Sephora",
    tint: "rgba(220,111,52,0.45)",
    img1: "/images/brands/sephora/1.webp",
    img2: "/images/brands/sephora/2.webp",
    label: "Sephora · US",
    logoSrc: "/images/brand/sephora-white.png",
    link: "https://www.sephora.com/",
  },
  {
    name: "Target",
    tint: "rgba(204,0,0,0.5)",
    img1: "/images/brands/target/1.webp",
    img2: "/images/brands/target/2.webp",
    label: "Target · US",
    logoSrc: "/images/brand/target-white.png",
    link: "https://www.target.com/",
  },
  {
    name: "Victoria's Secret",
    tint: "rgba(86,43,127,0.5)",
    img1: "/images/brands/vs/1.webp",
    img2: "/images/brands/vs/2.webp",
    label: "Victoria's Secret",
    logoSrc: "/images/brand/victorias-secret-white.png",
    link: "https://www.victoriassecret.com/us/",
  },
  {
    name: "Nike",
    tint: "rgba(0,140,255,0.45)",
    img1: "/images/brands/nike/1.png",
    img2: "/images/brands/nike/2.avif",
    label: "Nike · Global",
    logoSrc: "/images/brand/nike-white.png",
    link: "https://www.nike.com/us/es/",
  },
];

// Duplicate for seamless infinite scroll
const MARQUEE_LIST = [...BRANDS, ...BRANDS];

function BrandCardMarquee({ brand, idx }: Readonly<{ brand: BrandItem; idx: number }>) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const offset = (idx * 800) % 4000;
    const t = setTimeout(() => {
      setActive((a) => 1 - a);
      const interval = setInterval(() => setActive((a) => 1 - a), 4000);
      return () => clearInterval(interval);
    }, offset);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <a
      href={brand.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bm-card"
      style={{ "--brand-tint": brand.tint } as React.CSSProperties}
      aria-label={brand.name}
    >
      {/* Background images crossfade */}
      <div className="bm-imgs">
        <div
          className={`bm-img${active === 0 ? " active" : ""}`}
          style={{ backgroundImage: `url(${brand.img1})` }}
        />
        <div
          className={`bm-img${active === 1 ? " active" : ""}`}
          style={{ backgroundImage: `url(${brand.img2})` }}
        />
      </div>
      <div className="bm-veil" />
      <div className="bm-glow" />
      {/* Logo */}
      <div className="bm-logo">
        <img
          src={brand.logoSrc}
          alt={brand.name}
          style={{ filter: "brightness(0) invert(1)", mixBlendMode: "screen", maxWidth: 110, maxHeight: 50, objectFit: "contain" }}
          draggable={false}
        />
      </div>
      {/* Label */}
      <div className="bm-label">
        <span>{brand.label}</span>
        <span className="bm-live"><span className="bm-dot" /> EN VIVO</span>
      </div>
    </a>
  );
}

export default function BrandsMarqueeV8() {
  return (
    <>
      <section className="hv8-brands">
        <div className="hv8-section-head">
          <div className="hv8-section-eyebrow">Tu tienda favorita · A un click</div>
          <h2 className="hv8-section-title">Las mejores marcas del mundo</h2>
          <p className="hv8-section-sub">
            Compra en cualquiera de estas tiendas y muchas más. Si tiene link, lo traemos.
          </p>
        </div>

        <div className="bm-marquee-wrap">
          <div className="bm-track">
            {MARQUEE_LIST.map((b, i) => (
              <BrandCardMarquee key={`${b.name}-${i}`} brand={b} idx={i} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hv8-brands {
          padding: 60px 40px 40px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* === Marquee === */
        .bm-marquee-wrap {
          position: relative;
          overflow: hidden;
          padding: 8px 0;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%);
        }

        .bm-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: bm-scroll 40s linear infinite;
        }

        .bm-marquee-wrap:hover .bm-track {
          animation-play-state: paused;
        }

        @keyframes bm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 8px)); }
        }

        /* === Card === */
        .bm-card {
          position: relative;
          width: 240px;
          aspect-ratio: 3 / 4;
          flex-shrink: 0;
          border-radius: 22px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          isolation: isolate;
          text-decoration: none;
          display: block;
          transition: transform 0.4s;
        }
        .bm-card:hover { transform: translateY(-6px); }

        .bm-imgs { position: absolute; inset: 0; }

        .bm-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.2s ease, transform 6s ease;
        }
        .bm-img.active { opacity: 1; transform: scale(1.06); }

        .bm-veil {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%);
          z-index: 1;
        }

        .bm-glow {
          position: absolute; inset: -1px;
          border-radius: 22px;
          pointer-events: none;
          z-index: 2;
          box-shadow: inset 0 0 60px var(--brand-tint, rgba(220,111,52,0.3));
          opacity: 0.7;
          transition: opacity 0.4s;
        }
        .bm-card:hover .bm-glow { opacity: 1; }

        .bm-logo {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .bm-label {
          position: absolute;
          bottom: 14px;
          left: 16px; right: 16px;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255,255,255,0.85);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bm-live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .bm-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #dc6f34;
          box-shadow: 0 0 8px #dc6f34;
          animation: bm-pulse 2s infinite;
        }

        @keyframes bm-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 640px) {
          .hv8-brands { padding: 40px 0 30px; }
          .bm-card { width: 180px; }
        }
      `}</style>
    </>
  );
}
