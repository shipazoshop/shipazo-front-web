"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCartLength } from "@/application/stores/useCartStore";
import { Heart, Package } from "lucide-react";
import { useIsAuthenticated, useClearAuth } from "@/application/stores/useAuthStore";

export default function Toolbar() {
  const cartLength = useCartLength();
  const isAuthenticated = useIsAuthenticated();
  const clearAuth = useClearAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearAuth();
    setAccountOpen(false);
    globalThis.location.href = "/home";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountOpen]);

  return (
    <div className="tf-toolbar-bottom d-xl-none">
      <div className="toolbar-item">
        <Link href={`/wishlist`}>
          <span className="toolbar-icon">
            <Heart width={20} height={20} />
          </span>
          <span className="toolbar-label">Wishlist</span>
        </Link>
      </div>
      <div className="toolbar-item" ref={accountRef} style={{ position: "relative" }}>
        <button
          onClick={() => setAccountOpen((prev) => !prev)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span className="toolbar-icon">
            <svg
              width={20}
              height={20}
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.9998 11.5283C5.20222 11.5283 0.485352 16.2452 0.485352 22.0428C0.485352 22.2952 0.69017 22.5 0.942518 22.5C1.19487 22.5 1.39968 22.2952 1.39968 22.0428C1.39968 16.749 5.70606 12.4426 10.9999 12.4426C16.2937 12.4426 20.6001 16.749 20.6001 22.0428C20.6001 22.2952 20.8049 22.5 21.0572 22.5C21.3096 22.5 21.5144 22.2952 21.5144 22.0428C21.5144 16.2443 16.7975 11.5283 10.9998 11.5283Z"
                fill="#333E48"
                stroke="#333E48"
                strokeWidth="0.3"
              />
              <path
                d="M10.9999 0.5C8.22767 0.5 5.97119 2.75557 5.97119 5.52866C5.97119 8.30174 8.22771 10.5573 10.9999 10.5573C13.772 10.5573 16.0285 8.30174 16.0285 5.52866C16.0285 2.75557 13.772 0.5 10.9999 0.5ZM10.9999 9.64303C8.73146 9.64303 6.88548 7.79705 6.88548 5.52866C6.88548 3.26027 8.73146 1.41429 10.9999 1.41429C13.2682 1.41429 15.1142 3.26027 15.1142 5.52866C15.1142 7.79705 13.2682 9.64303 10.9999 9.64303Z"
                fill="#333E48"
                stroke="#333E48"
                strokeWidth="0.3"
              />
            </svg>
          </span>
          <span className="toolbar-label">Account</span>
        </button>

        {accountOpen && (
          <>
            {/* Overlay translúcido detrás del menú */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 999,
              }}
              onClick={() => setAccountOpen(false)}
            />
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 12px)",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#ffffff",
                border: "1px solid #e1e1e1",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                minWidth: "210px",
                zIndex: 1000,
                overflow: "hidden",
              }}
            >
              {/* Cabecera del menú */}
              <div
                style={{
                  padding: "14px 16px 12px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width={18} height={18} viewBox="0 0 22 23" fill="none">
                    <path
                      d="M10.9998 11.5283C5.20222 11.5283 0.485352 16.2452 0.485352 22.0428C0.485352 22.2952 0.69017 22.5 0.942518 22.5C1.19487 22.5 1.39968 22.2952 1.39968 22.0428C1.39968 16.749 5.70606 12.4426 10.9999 12.4426C16.2937 12.4426 20.6001 16.749 20.6001 22.0428C20.6001 22.2952 20.8049 22.5 21.0572 22.5C21.3096 22.5 21.5144 22.2952 21.5144 22.0428C21.5144 16.2443 16.7975 11.5283 10.9998 11.5283Z"
                      fill="#333E48"
                      stroke="#333E48"
                      strokeWidth="0.3"
                    />
                    <path
                      d="M10.9999 0.5C8.22767 0.5 5.97119 2.75557 5.97119 5.52866C5.97119 8.30174 8.22771 10.5573 10.9999 10.5573C13.772 10.5573 16.0285 8.30174 16.0285 5.52866C16.0285 2.75557 13.772 0.5 10.9999 0.5ZM10.9999 9.64303C8.73146 9.64303 6.88548 7.79705 6.88548 5.52866C6.88548 3.26027 8.73146 1.41429 10.9999 1.41429C13.2682 1.41429 15.1142 3.26027 15.1142 5.52866C15.1142 7.79705 13.2682 9.64303 10.9999 9.64303Z"
                      fill="#333E48"
                      stroke="#333E48"
                      strokeWidth="0.3"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#333E48",
                    lineHeight: 1.3,
                  }}
                >
                  {isAuthenticated ? "Mi cuenta" : "Bienvenido"}
                </span>
              </div>

              {/* Opciones del menú */}
              <ul style={{ listStyle: "none", margin: 0, padding: "6px 0" }}>
                {isAuthenticated && (
                  <li>
                    <Link
                      href="/configurations/address"
                      onClick={() => setAccountOpen(false)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                        padding: "11px 16px",
                        color: "#333E48",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#333E48" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      Configuraciones
                    </Link>
                  </li>
                )}

                {/* Separador solo cuando hay dos opciones */}
                {isAuthenticated && (
                  <li style={{ height: "1px", backgroundColor: "#f0f0f0", margin: "4px 16px" }} />
                )}

                <li>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "11px 16px",
                        color: "#ff3d3d",
                        fontSize: "13px",
                        fontWeight: 500,
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ff3d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Cerrar sesión
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                        padding: "11px 16px",
                        color: "#333E48",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#333E48" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Iniciar sesión
                    </Link>
                  )}
                </li>
              </ul>

              {/* Triángulo indicador apuntando hacia abajo */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "12px",
                  height: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e1e1e1",
                    transform: "rotate(45deg)",
                    transformOrigin: "center",
                    margin: "-4px auto 0",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.06)",
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="toolbar-item">
        <Link href="/orders">
          <span className="toolbar-icon">
            <Package width={20} height={20} strokeWidth={1.5} />
          </span>
          <span className="toolbar-label">Pedidos</span>
        </Link>
      </div>
      <div className="toolbar-item">
        <a href="#shoppingCart" data-bs-toggle="offcanvas">
          <span className="toolbar-icon">
            <svg
              width={20}
              height={20}
              viewBox="0 0 26 26"
              strokeWidth="0.3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.55865 19.1096C6.8483 19.1096 5.46191 20.496 5.46191 22.2064C5.46191 23.9165 6.8483 25.3029 8.55865 25.3029C10.2688 25.3029 11.6552 23.9165 11.6552 22.2064C11.6534 20.4969 10.2681 19.1114 8.55865 19.1096ZM8.55865 24.1644C7.47712 24.1644 6.60037 23.2877 6.60037 22.2064C6.60037 21.1248 7.47712 20.2481 8.55865 20.2481C9.63996 20.2481 10.5167 21.1248 10.5167 22.2064C10.5167 23.2877 9.63996 24.1644 8.55865 24.1644Z"
                fill="#333E48"
              />
              <path
                d="M25.436 6.1144H5.33643L4.92663 3.82036C4.67403 2.40819 3.56715 1.30353 2.15453 1.05382L0.668757 0.792113C0.359017 0.736969 0.0635073 0.943536 0.00836329 1.25305C-0.0465584 1.56279 0.159787 1.8583 0.469527 1.91345L1.96086 2.17516C2.90187 2.34193 3.63853 3.07859 3.80529 4.01959L5.82027 15.387C6.05819 16.7472 7.24001 17.7393 8.62083 17.738H20.5746C21.8305 17.7418 22.9396 16.9197 23.3014 15.7172L25.9767 6.84861C26.0263 6.67562 25.995 6.48929 25.8913 6.34209C25.7831 6.19956 25.6147 6.11551 25.436 6.1144ZM22.214 15.3813C21.9992 16.1035 21.3337 16.5975 20.5804 16.5938H8.62661C7.79745 16.596 7.08769 15.9994 6.94739 15.182L5.54144 7.24707H24.6731L22.214 15.3813Z"
                fill="#333E48"
              />
              <path
                d="M20.512 19.1096C18.8017 19.1096 17.4153 20.496 17.4153 22.2064C17.4153 23.9165 18.8017 25.3029 20.512 25.3029C22.2221 25.3029 23.6085 23.9165 23.6085 22.2064C23.6068 20.4969 22.2215 19.1114 20.512 19.1096ZM20.512 24.1644C19.4305 24.1644 18.5537 23.2877 18.5537 22.2064C18.5537 21.1248 19.4305 20.2481 20.512 20.2481C21.5933 20.2481 22.4701 21.1248 22.4701 22.2064C22.4701 23.2877 21.5933 24.1644 20.512 24.1644Z"
                fill="#333E48"
              />
            </svg>
            <span className="toolbar-count">{cartLength}</span>
          </span>
          <span className="toolbar-label">Cart</span>
        </a>
      </div>
    </div>
  );
}
