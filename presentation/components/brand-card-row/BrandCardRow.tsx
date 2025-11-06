import React from "react";
import styles from "./BrandCardRow.module.css";
import BrandCard from "../brand-slide/BrandSlide";

export interface IBrandItem  {
  brand: string;
  logoSrc: string;
  images: string[];
  intervalMs?: number;
  link: string;
};

type BrandCardRowProps = {
  items: IBrandItem[];
  gap?: number;
  cardMinWidth?: number; 
};

export default function BrandCardRow({
  items,
  gap = 16,
  cardMinWidth = 220,
}: Readonly<BrandCardRowProps>) {
  return (
    <div
      className={styles.row}
      style={
        {
          "--gap": `${gap}px`,
          "--minw": `${cardMinWidth}px`,
        } as React.CSSProperties
      }
    >
      {items.map((it) => (
        <div key={it.brand} className={styles.item}>
          <BrandCard
            brand={it.brand}
            logoSrc={it.logoSrc}
            images={it.images}
            link={it.link}
            intervalMs={it.intervalMs}
            aspectRatio="3 / 4"
          />
        </div>
      ))}
    </div>
  );
}
