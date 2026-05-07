"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/application/state/product";
import { useProductRepository } from "@/presentation";
import { LoadingScreen } from "./LoadingScreen";

/**
 * SearchBarV8 — pill glass search bar used in the V8 hero.
 * Reusable: drop it anywhere on a dark background.
 */
export default function SearchBarV8({ className }: Readonly<{ className?: string }>) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setProduct } = useProductStore();
  const router = useRouter();
  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isLoading } = importProductFromUrl();

  const handleSubmit = async () => {
    if (!searchTerm.trim()) {
      inputRef.current?.focus();
      return;
    }
    try {
      const result = await mutateAsync({ url: searchTerm });
      const productUrl = encodeURIComponent(searchTerm);
      router.push(`/product-detail/${result.productData.product_id}?url=${productUrl}`);
      setProduct(result);
      setSearchTerm("");
    } catch (error) {
      console.error("Error al importar producto:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <div className={`sbv8-wrap${className ? ` ${className}` : ""}`}>
        <span className="sbv8-pre" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </span>
        <input
          ref={inputRef}
          className="sbv8-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pega aquí el link de Amazon, Shein, AliExpress…"
          disabled={isLoading}
        />
        <button
          className="sbv8-btn"
          onClick={handleSubmit}
          disabled={isLoading}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          Cotizar
        </button>
      </div>

      <LoadingScreen show={isLoading} />

      <style>{`
        .sbv8-wrap {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 24px 60px -20px rgba(0,0,0,0.5);
          width: 100%;
          max-width: 720px;
        }

        .sbv8-pre {
          padding: 0 6px 0 14px;
          color: rgba(255,255,255,0.5);
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .sbv8-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 15px;
          padding: 12px 4px;
          font-family: inherit;
          min-width: 0;
        }
        .sbv8-input::placeholder { color: rgba(255,255,255,0.45); }
        .sbv8-input:disabled { opacity: 0.6; }

        .sbv8-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #dc6f34, #f4a261);
          color: white;
          border: none;
          border-radius: 999px;
          font-weight: 700;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-family: inherit;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .sbv8-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sbv8-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 600px) {
          .sbv8-wrap { border-radius: 20px; padding: 6px; }
          .sbv8-pre { padding: 0 4px 0 10px; }
          .sbv8-input { font-size: 14px; padding: 10px 4px; }
          .sbv8-btn { padding: 10px 16px; font-size: 13px; }
        }
      `}</style>
    </>
  );
}
