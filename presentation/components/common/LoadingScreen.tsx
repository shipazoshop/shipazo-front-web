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
      <div className="loading-screen-container">
        <div className="loading-logo-wrapper">
          <Image
            src="/images/logo/horizontal-shipazo.webp"
            alt="Shipazo Logo"
            width={250}
            height={80}
            className="loading-logo"
            priority
          />
        </div>
        <p className={`loading-phrase ${fade ? 'fade-in' : 'fade-out'}`}>
          {displayPhrase}
        </p>
      </div>

      <style>{`
        .loading-screen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(to bottom, #ffffff 0%, #ffffff 60%, rgba(234, 77, 48, 0.18) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-screen-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .loading-logo-wrapper {
          animation: heartbeat 2s ease-in-out infinite;
        }

        .loading-logo {
          display: block;
          width: auto;
          height: auto;
        }

        .loading-phrase {
          font-size: 1.125rem;
          font-weight: 500;
          color: #333333;
          text-align: center;
          max-width: 400px;
          padding: 0 1rem;
          transition: opacity 0.3s ease-in-out;
        }

        .loading-phrase.fade-in {
          opacity: 1;
        }

        .loading-phrase.fade-out {
          opacity: 0;
        }

        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.1);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .loading-logo-wrapper {
            width: 200px;
          }

          .loading-phrase {
            font-size: 1rem;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
