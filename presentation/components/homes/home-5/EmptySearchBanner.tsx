"use client";
import React from "react";
import Image from "next/image";

export default function EmptySearchBanner() {
  return (
    <div className="empty-search-banner">
      <div className="empty-search-content">
        <div className="logo-container">
          <Image
            src="/images/logo/horizontal-shipazo.webp"
            alt="Shipazo Logo"
            width={300}
            height={100}
            className="brand-logo"
            priority
          />
        </div>
        <div className="search-prompt">
          <h2 className="main-text">Empieza buscando un producto</h2>
          <p className="sub-text">Encuentra lo que necesitas en nuestra amplia selección</p>
          <div className="search-icon-wrapper">
            <i className="icon-search search-icon" />
          </div>
        </div>
      </div>

      <style>{`
        .empty-search-banner {
          width: 100%;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          border-radius: 12px;
          margin: 2rem 0;
        }

        .empty-search-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 600px;
          gap: 2.5rem;
        }

        .logo-container {
          animation: fadeInDown 0.8s ease-out;
        }

        .brand-logo {
          width: auto;
          height: auto;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }

        .search-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .main-text {
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .sub-text {
          font-size: 1.125rem;
          color: #666666;
          margin: 0;
          font-weight: 400;
        }

        .search-icon-wrapper {
          margin-top: 1rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .search-icon {
          font-size: 1.5rem;
          color: #ffffff;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
          }
        }

        @media (max-width: 768px) {
          .empty-search-banner {
            min-height: 350px;
            padding: 2rem 1rem;
          }

          .logo-container {
            width: 220px;
          }

          .main-text {
            font-size: 1.5rem;
          }

          .sub-text {
            font-size: 1rem;
          }

          .search-icon-wrapper {
            width: 50px;
            height: 50px;
          }

          .search-icon {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .main-text {
            font-size: 1.25rem;
          }

          .sub-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
