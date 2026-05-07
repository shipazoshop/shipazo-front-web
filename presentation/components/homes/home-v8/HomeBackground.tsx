"use client";
import React, { useEffect, useRef } from "react";

export default function HomeBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Override the global body background-color: white from _reset.scss
  // Only while this home page is mounted — cleaned up on unmount
  useEffect(() => {
    document.body.classList.add("hv8-body");
    document.documentElement.classList.add("hv8-html");
    return () => {
      document.body.classList.remove("hv8-body");
      document.documentElement.classList.remove("hv8-html");
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY;
      const k = 0.18;
      bgRef.current.style.transform = `translate3d(0, ${y * k * -1}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hv8-bg-stage" aria-hidden="true">
        <div className="hv8-bg-mesh" ref={bgRef} />
        <div className="hv8-bg-stars" />
      </div>
      <div className="hv8-grain" aria-hidden="true" />

      <style>{`
        /* Override global body white background for this page only */
        html.hv8-html,
        html.hv8-html body.hv8-body {
          background-color: #14071f !important;
        }

        /* Also neutralize #wrapper if it carries a background */
        html.hv8-html #wrapper {
          background-color: transparent !important;
        }

        .hv8-bg-stage {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .hv8-bg-mesh {
          position: absolute;
          inset: -10%;
          background-color: #14071f;
          background-image:
            radial-gradient(at 18% 8%, rgba(106,58,153,0.95) 0%, transparent 45%),
            radial-gradient(at 85% 25%, rgba(220,111,52,0.65) 0%, transparent 50%),
            radial-gradient(at 95% 90%, rgba(86,43,127,0.85) 0%, transparent 45%),
            radial-gradient(at 30% 95%, rgba(220,111,52,0.35) 0%, transparent 45%);
          will-change: transform;
        }

        .hv8-bg-stars {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5) 50%, transparent 100%),
            radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.4) 50%, transparent 100%),
            radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.3) 50%, transparent 100%),
            radial-gradient(1px 1px at 90% 15%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 800px 600px;
          opacity: 0.6;
        }

        .hv8-grain {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.05;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>");
        }
      `}</style>
    </>
  );
}
