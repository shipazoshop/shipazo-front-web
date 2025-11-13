"use client";
import React from "react";
import Image from "next/image";

export default function HowItWorks() {
  return (
    <div className="how-it-works-section">
      <div className="container">
        <div className="steps-grid">
          {/* Paso 1: COPIA */}
          <div className="step-card step-1">
            <div className="step-content">
              <h3 className="step-title">COPIA</h3>
              <p className="step-description">
                Busca tu artículo que deseas comprar y copia el link
              </p>
              <div className="step-arrow">
                <svg
                  width="120"
                  height="40"
                  viewBox="0 0 120 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="30"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="40"
                    y1="20"
                    x2="50"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M70 10L90 20L70 30"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Paso 2: PEGA */}
          <div className="step-card step-2">
            <div className="step-content">
              <h3 className="step-title">PEGA</h3>
              <p className="step-description">
                Pega el link del enlace en el cotizador.
              </p>
              <div className="step-arrow">
                <svg
                  width="120"
                  height="40"
                  viewBox="0 0 120 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="30"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="40"
                    y1="20"
                    x2="50"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M70 10L90 20L70 30"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Paso 3: COMPRA */}
          <div className="step-card step-3">
            <div className="step-content">
              <h3 className="step-title">COMPRA</h3>
              <p className="step-description">
                Llena los datos, cotiza y realiza la compra.
              </p>
              <div className="step-arrow">
                <svg
                  width="120"
                  height="40"
                  viewBox="0 0 120 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="30"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="40"
                    y1="20"
                    x2="50"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M70 10L90 20L70 30"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Logo Card */}
          <div className="step-card step-logo">
            <div className="logo-content">
              <div className="logo-wrapper">
                <Image
                  src="/images/logo/horizontal-shipazo.webp"
                  alt="Shipazo"
                  width={220}
                  height={80}
                  className="shipazo-logo"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .how-it-works-section {
          padding: 4rem 0;
          width: 100%;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        .step-card {
          border-radius: 24px;
          padding: 2.5rem 2.5rem;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .step-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .step-1 {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
        }

        .step-2 {
        background: linear-gradient(135deg, #004ec3 0%, #0066ff 100%);
          color: white;
        }

        .step-3 {
        background: linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%);
        
          color: white;
        }

        .step-logo {
   background: linear-gradient(135deg, #FCB500 0%, #ffd43b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin: 0;
          text-transform: uppercase;
          font-family: var(--font-poppins), "Poppins", sans-serif;
        }

        .step-description {
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0;
          opacity: 0.95;
          font-weight: 400;
        }

        .step-arrow {
          margin-top: auto;
          color: currentColor;
          opacity: 0.9;
        }

        .logo-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .shipazo-logo {
          width: auto;
          height: auto;
          max-width: 100%;
          filter: brightness(1.1);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .how-it-works-section {
            padding: 2rem 0;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .step-card {
            min-height: 240px;
            padding: 2rem 1.5rem;
          }

          .step-title {
            font-size: 2rem;
          }

          .step-description {
            font-size: 1rem;
          }

          .step-arrow svg {
            width: 100px;
          }
        }

        @media (max-width: 480px) {
          .step-card {
            min-height: 220px;
            padding: 1.5rem 1.25rem;
          }

          .step-title {
            font-size: 1.75rem;
          }

          .step-description {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
