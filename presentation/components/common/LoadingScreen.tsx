"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { loadingPhrases } from "@/shared/constants/loadingPhrases";

interface LoadingScreenProps {
  customPhrase?: string;
  show: boolean;
  phraseInterval?: number;
}

export const LoadingScreen = ({
  customPhrase,
  phraseInterval = 6000,
  show
}: LoadingScreenProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const advancePhrase = useCallback(() => {
    setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length);
  }, [loadingPhrases.length]);

  const schedulePhraseChange = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      advancePhrase();
      setFade(true);
    }, 300);
  }, [advancePhrase]);

  useEffect(() => {
    if (customPhrase) return;

    const interval = setInterval(schedulePhraseChange, phraseInterval);

    return () => clearInterval(interval);
  }, [customPhrase, phraseInterval, schedulePhraseChange]);

  if (!show) return null;

  const displayPhrase = customPhrase || loadingPhrases[currentPhraseIndex];

  return (
    <div className="loading-screen-overlay">
      {/* Capa de fondo: manchas de lava */}
      <div className="loading-blobs" aria-hidden="true">
        <span className="loading-blob loading-blob--1"></span>
        <span className="loading-blob loading-blob--2"></span>
        <span className="loading-blob loading-blob--3"></span>
        <span className="loading-blob loading-blob--4"></span>
        <span className="loading-blob loading-blob--5"></span>
      </div>

      {/* Capa de contenido */}
      <div className="loading-screen-container">
        <div className="loading-logo-wrapper">
          <span className="loading-ring" aria-hidden="true"></span>
          <Image
            src="/images/logo/horizontal-shipazo.webp"
            alt="Shipazo Logo"
            width={250}
            height={80}
            className="loading-logo"
            priority
          />
        </div>

        <div className="loading-phrase-slot">
          <p className={`loading-phrase ${fade ? 'fade-in' : 'fade-out'}`}>
            {displayPhrase}
          </p>
        </div>

        <div className="loading-bar-track">
          <span className="loading-bar-fill"></span>
        </div>
      </div>

      <style>{`
        .loading-screen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(120% 90% at 50% 15%, #6a3699 0%, #562b7f 45%, #2f1649 100%);
          font-family: Montserrat, sans-serif;
          z-index: 9999;
        }

        .loading-blobs {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .loading-blob {
          position: absolute;
          aspect-ratio: 1;
          border-radius: 50%;
          display: block;
        }

        .loading-blob--1 {
          width: 42%;
          left: -8%;
          bottom: -8%;
          filter: blur(42px);
          background: radial-gradient(circle at 40% 35%, #ff7a45, #ea4d30 56%, rgba(234,77,48,0) 74%);
          animation: lvRise 7.5s ease-in-out infinite;
        }
        .loading-blob--2 {
          width: 34%;
          right: -6%;
          bottom: -6%;
          filter: blur(40px);
          background: radial-gradient(circle at 40% 35%, #FCB500, #ea4d30 60%, rgba(234,77,48,0) 76%);
          animation: lvRise2 9s ease-in-out infinite;
        }
        .loading-blob--3 {
          width: 28%;
          left: 22%;
          bottom: 2%;
          filter: blur(38px);
          background: radial-gradient(circle at 40% 35%, #ff6a3d, #ea4d30 58%, rgba(234,77,48,0) 75%);
          animation: lvRise 10s ease-in-out 1.2s infinite;
        }
        .loading-blob--4 {
          width: 40%;
          left: -6%;
          top: -10%;
          filter: blur(48px);
          background: radial-gradient(circle at 45% 45%, #ff8a52, #ea4d30 58%, rgba(234,77,48,0) 76%);
          animation: lvB 8.5s ease-in-out infinite;
        }
        .loading-blob--5 {
          width: 32%;
          right: -8%;
          top: 6%;
          filter: blur(44px);
          background: radial-gradient(circle at 45% 45%, #FCB500, #ea4d30 62%, rgba(234,77,48,0) 78%);
          animation: lvA 9.5s ease-in-out infinite;
        }

        .loading-screen-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 34px;
          padding: 6%;
        }

        .loading-logo-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-ring {
          position: absolute;
          width: 290px;
          height: 290px;
          border-radius: 50%;
          border: 2px solid rgba(252, 181, 0, 0.5);
          animation: lvRing 4s ease-in-out infinite;
          pointer-events: none;
        }

        .loading-logo {
          display: block;
          width: auto;
          height: auto;
          position: relative;
        }

        .loading-phrase-slot {
          min-height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .loading-phrase {
          margin: 0;
          font-family: Montserrat, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
          text-align: center;
          max-width: 400px;
          padding: 0 1rem;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .loading-phrase.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .loading-phrase.fade-out {
          opacity: 0;
          transform: translateY(12px);
        }

        .loading-bar-track {
          width: 170px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.15);
          overflow: hidden;
        }

        .loading-bar-fill {
          display: block;
          width: 32%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #FCB500, #ea4d30);
          animation: lvBar 1.9s ease-in-out infinite;
        }

        @keyframes lvA {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -90px) scale(1.28); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes lvB {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-70px, -70px) scale(0.85); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes lvRise {
          0% { transform: translate(0, 8%) scale(0.95); }
          50% { transform: translate(30px, -70%) scale(1.35); }
          100% { transform: translate(0, 8%) scale(0.95); }
        }
        @keyframes lvRise2 {
          0% { transform: translate(0, 12%) scale(1); }
          50% { transform: translate(-40px, -90%) scale(1.4); }
          100% { transform: translate(0, 12%) scale(1); }
        }
        @keyframes lvRing {
          0% { transform: scale(0.82); opacity: 0.55; }
          50% { transform: scale(1.18); opacity: 0.12; }
          100% { transform: scale(0.82); opacity: 0.55; }
        }
        @keyframes lvBar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(360%); }
        }

        @media (max-width: 768px) {
          .loading-logo-wrapper {
            width: 200px;
          }
          .loading-logo {
            max-width: 200px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-blob,
          .loading-ring,
          .loading-bar-fill {
            animation: none;
          }
          .loading-phrase {
            transition: opacity 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
}
