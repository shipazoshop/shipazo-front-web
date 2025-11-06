import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./BrandCard.module.css";

export interface IBrandCardProps  {
  brand: string;
  logoSrc: string;
  images: string[];
  intervalMs?: number;
  aspectRatio?: string;
  forceWhiteLogo?: boolean;
  borderRadius?: string;
  link: string;
  openInNewTab?: boolean;
};

export default function BrandCard({
  brand,
  logoSrc,
  images,
  intervalMs = 4000,
  aspectRatio = "3 / 4",
  forceWhiteLogo = true,
  borderRadius = "16px",
  link,
  openInNewTab = true
}: Readonly<IBrandCardProps>) {
  const [active, setActive] = useState<0 | 1>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev === 0 ? 1 : 0));
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  const [imgA, imgB] = images;

  const logoFilter = useMemo(
    () => (forceWhiteLogo ? { filter: "brightness(0) invert(1)" } : undefined),
    [forceWhiteLogo]
  );
  const Wrapper = link ? "a" : "div";

  return (
    <Wrapper
      className={styles.card}
      style={
        {
          "--radius": borderRadius,
          aspectRatio,
        } as React.CSSProperties
      }
      href={link}
      target={openInNewTab ?"_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={link ? `${brand} - Ir al sitio oficial` : brand}
    >
      <img
        src={imgA}
        alt={`${brand} background A`}
        className={`${styles.bg} ${active === 0 ? styles.bgVisible : ""}`}
        draggable={false}
      />
      <img
        src={imgB}
        alt={`${brand} background B`}
        className={`${styles.bg} ${active === 1 ? styles.bgVisible : ""}`}
        draggable={false}
      />

      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.logoWrap}>
        <img
          src={logoSrc}
          alt={`${brand} logo`}
          className={styles.logo}
          style={{...logoFilter, 
            filter: "brightness(0) invert(1)",
            mixBlendMode: "screen"
          }}
          draggable={false}
        />
      </div>
      <figcaption className="sr-only">{brand}</figcaption>
    </Wrapper>
  );
}
