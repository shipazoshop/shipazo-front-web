"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";

export default function ProductGalleryV8({ images }: Readonly<{ images: string[] }>) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({});
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  const safeImages = images?.length ? images : ["/images/logo/favicon-shipazo.webp"];

  // Medir las dimensiones reales de cada imagen para que el zoom (PhotoSwipe)
  // respete su aspect ratio en lugar de forzar un cuadrado.
  useEffect(() => {
    let cancelled = false;
    const measure = (src: string) => {
      const img = new globalThis.Image();
      img.onload = () => {
        if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
        setDims((prev) =>
          prev[src] ? prev : { ...prev, [src]: { w: img.naturalWidth, h: img.naturalHeight } }
        );
      };
      img.src = src;
    };
    safeImages.forEach(measure);
    return () => {
      cancelled = true;
    };
  }, [safeImages.join("|")]);

  useEffect(() => {
    const lb = new PhotoSwipeLightbox({
      gallery: "#pgv8-main",
      children: ".pgv8-slide-link",
      pswpModule: () => import("photoswipe"),
    });
    lb.init();
    lightboxRef.current = lb;
    return () => lb.destroy();
  }, []);

  return (
    <>
      <div className="pgv8-wrap">
        {/* Thumbnails — vertical column */}
        <div className="pgv8-thumbs-col">
          <Swiper
            className="pgv8-thumbs"
            modules={[Navigation, Thumbs]}
            onSwiper={setThumbsSwiper}
            direction="vertical"
            spaceBetween={10}
            slidesPerView="auto"
            watchSlidesProgress
            observer
            observeParents
            freeMode
            breakpoints={{
              0: { direction: "horizontal" },
              960: { direction: "vertical" },
            }}
          >
            {safeImages.map((src, i) => (
              <SwiperSlide key={i} className={`pgv8-thumb ${activeIndex === i ? "pgv8-thumb-active" : ""}`}>
                <div className="pgv8-thumb-inner">
                  <Image
                    src={src}
                    alt={`Vista ${i + 1}`}
                    fill
                    sizes="72px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Main image */}
        <div className="pgv8-main-col">
          {/* Chips */}
          <div className="pgv8-chips">
            <span className="pgv8-chip pgv8-chip-orange">
              <span className="pgv8-chip-dot" />
              Envío internacional
            </span>
            <span className="pgv8-chip">Llega en 7-9 días</span>
          </div>

          {/* Zoom tool */}
          <div className="pgv8-tools">
            <button
              className="pgv8-tool"
              title="Zoom"
              onClick={() => {
                const link = document.querySelector<HTMLAnchorElement>(".pgv8-slide-link");
                if (link) link.click();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /><path d="M11 8v6M8 11h6" />
              </svg>
            </button>
          </div>

          <Swiper
            id="pgv8-main"
            className="pgv8-main"
            modules={[Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          >
            {safeImages.map((src, i) => (
              <SwiperSlide key={i}>
                <a
                  href={src}
                  className="pgv8-slide-link"
                  data-pswp-width={dims[src]?.w ?? 1200}
                  data-pswp-height={dims[src]?.h ?? 1200}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={src}
                    alt={`Imagen ${i + 1}`}
                    fill
                    sizes="(max-width: 960px) 100vw, 500px"
                    style={{ objectFit: "contain" }}
                    priority={i === 0}
                  />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination dots */}
          {safeImages.length > 1 && (
            <div className="pgv8-pagination">
              {safeImages.map((_, i) => (
                <span key={i} className={`pgv8-dot ${activeIndex === i ? "pgv8-dot-active" : ""}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ── Outer wrapper ── */
        .pgv8-wrap {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 12px;
          height: 480px;
        }

        /* ── Thumb column ── */
        .pgv8-thumbs-col {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .pgv8-thumbs {
          width: 100%;
          height: 100%;
          min-height: 0;
        }

        .pgv8-thumb {
          width: 80px !important;
          height: 80px !important;
          border-radius: 12px;
          border: 1.5px solid #ECE5DC;
          background: white;
          padding: 6px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
          overflow: hidden;
          flex-shrink: 0;
        }

        .pgv8-thumb:hover {
          border-color: #F4A261;
          transform: translateY(-2px);
        }

        .pgv8-thumb-active {
          border: 2px solid #DC6F34 !important;
          padding: 5px;
        }

        .pgv8-thumb-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* ── Main image ── */
        .pgv8-main-col {
          position: relative;
          min-width: 0;
          height: 100%;
        }

        .pgv8-main {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          border: 1px solid #ECE5DC;
          background: white;
          overflow: hidden;
        }

        .pgv8-main::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background:
            radial-gradient(circle at 20% 20%, rgba(253,244,237,0.8) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(244,240,248,0.6) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        /* Swiper necesita altura explícita en su wrapper y slides para no
           colapsar/desbordar al combinarse con next/image fill. */
        .pgv8-main .swiper-wrapper {
          height: 100%;
        }

        .pgv8-main .swiper-slide {
          position: relative;
          height: 100%;
          box-sizing: border-box;
          padding: 32px;
        }

        .pgv8-slide-link {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* ── Chips ── */
        .pgv8-chips {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pgv8-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: white;
          border: 1px solid #ECE5DC;
          font-size: 11px;
          font-weight: 700;
          color: #1A0D24;
          box-shadow: 0 4px 12px -4px rgba(20,7,31,0.08);
        }

        .pgv8-chip-orange {
          background: #DC6F34;
          color: white;
          border-color: #DC6F34;
        }

        .pgv8-chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }

        /* ── Tools ── */
        .pgv8-tools {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
          display: flex;
          gap: 8px;
        }

        .pgv8-tool {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: white;
          border: 1px solid #ECE5DC;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #4A3D57;
          cursor: pointer;
          box-shadow: 0 4px 12px -4px rgba(20,7,31,0.08);
          transition: color 0.2s, transform 0.2s;
        }

        .pgv8-tool:hover {
          color: #DC6F34;
          transform: translateY(-1px);
        }

        /* ── Pagination dots ── */
        .pgv8-pagination {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .pgv8-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D8D0C4;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .pgv8-dot-active {
          background: #DC6F34;
          width: 24px;
          border-radius: 4px;
        }

        /* ── Responsive: mobile → horizontal thumbs below ── */
        @media (max-width: 959px) {
          .pgv8-wrap {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            height: auto;
          }

          .pgv8-main-col {
            aspect-ratio: auto;
            height: 320px;
            order: 1;
          }

          .pgv8-thumbs-col {
            order: 2;
            height: 72px;
          }

          .pgv8-thumbs {
            height: 72px !important;
          }

          .pgv8-thumb {
            width: 72px !important;
            height: 72px !important;
          }
        }
      `}</style>
    </>
  );
}
