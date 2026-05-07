"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useClearAuth } from "@/application/stores/useAuthStore";
import { CircleUserRound } from "lucide-react";

export default function UserMenu({ iconColor = "currentColor", variant }: Readonly<{ iconColor?: string; variant?: "v8" }>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRefLi = useRef<HTMLLIElement>(null);
  const dropdownRefDiv = useRef<HTMLDivElement>(null);
  const isAuthenticated = useIsAuthenticated();
  const clearAuth = useClearAuth();

  useEffect(() => {
    setMounted(true);
  }, [isAuthenticated]);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    clearAuth();
    closeMenu();
    globalThis.location.href = "/home";
  };

  const handleLogin = () => {
    closeMenu();
    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const activeRef = variant === "v8" ? dropdownRefDiv : dropdownRefLi;
    const handleClickOutside = (event: MouseEvent) => {
      if (activeRef.current && !activeRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, variant]);

  // ── V8 skeleton (SSR placeholder) ──────────────────────────────────────────
  if (!mounted && variant === "v8") {
    return (
      <button className="hv8-nav-cta" style={{ opacity: 0.5 }} disabled>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Mi cuenta
      </button>
    );
  }

  // ── Default skeleton (SSR placeholder) ────────────────────────────────────
  if (!mounted) {
    return (
      <li className="nav-account">
        <div className="link nav-icon-item" style={{ display: "flex", alignItems: "center", opacity: 0.5 }}>
          <CircleUserRound width={30} height={30} strokeWidth={0.75} color={iconColor} />
        </div>
      </li>
    );
  }

  // ── V8 variant ─────────────────────────────────────────────────────────────
  if (variant === "v8") {
    return (
      <div ref={dropdownRefDiv} style={{ position: "relative" }}>
        <button onClick={toggleMenu} className="hv8-nav-cta" title="Mi cuenta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Mi cuenta
        </button>

        {isOpen && (
          <div className="hv8-user-dropdown">
            <ul>
              {isAuthenticated && (
                <li>
                  <a href="/configurations/address" onClick={closeMenu}>Configuraciones</a>
                </li>
              )}
              <li>
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="hv8-dropdown-btn danger">Cerrar sesión</button>
                ) : (
                  <button onClick={handleLogin} className="hv8-dropdown-btn">Iniciar sesión</button>
                )}
              </li>
            </ul>
          </div>
        )}

        <style>{`
          .hv8-nav-cta {
            padding: 10px 18px;
            background: linear-gradient(135deg, #dc6f34, #f4a261);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 0 8px 24px -8px rgba(220,111,52,0.7);
            font-family: inherit;
            transition: opacity 0.2s, transform 0.2s;
          }
          .hv8-nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }
          .hv8-user-dropdown {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            background: rgba(20,7,31,0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 12px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.4);
            min-width: 180px;
            z-index: 1000;
            overflow: hidden;
          }
          .hv8-user-dropdown ul { list-style: none; margin: 0; padding: 6px; }
          .hv8-user-dropdown li a,
          .hv8-dropdown-btn {
            display: block;
            width: 100%;
            padding: 10px 14px;
            color: rgba(255,255,255,0.85);
            text-decoration: none;
            font-size: 14px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            border-radius: 8px;
            font-family: inherit;
            transition: background 0.15s, color 0.15s;
          }
          .hv8-user-dropdown li a:hover,
          .hv8-dropdown-btn:hover { background: rgba(255,255,255,0.08); color: white; }
          .hv8-dropdown-btn.danger { color: #f4a261; }
          .hv8-dropdown-btn.danger:hover { background: rgba(220,111,52,0.15); color: #dc6f34; }
        `}</style>
      </div>
    );
  }

  // ── Default variant ────────────────────────────────────────────────────────
  return (
    <li className="nav-account" ref={dropdownRefLi} style={{ position: "relative" }}>
      <button
        onClick={toggleMenu}
        className="link nav-icon-item"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
        title="Mi cuenta"
      >
        <CircleUserRound width={30} height={30} strokeWidth={0.75} color={iconColor} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minWidth: "200px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {isAuthenticated && (
              <li>
                <Link
                  href="/configurations/address"
                  onClick={closeMenu}
                  style={{ display: "block", padding: "12px 16px", color: "#333E48", textDecoration: "none", fontSize: "14px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Configuraciones
                </Link>
              </li>
            )}
            <li>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  style={{ display: "block", width: "100%", padding: "12px 16px", color: "#ff3d3d", fontSize: "14px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff5f5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  style={{ display: "block", width: "100%", padding: "12px 16px", color: "#333E48", fontSize: "14px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Iniciar sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </li>
  );
}
