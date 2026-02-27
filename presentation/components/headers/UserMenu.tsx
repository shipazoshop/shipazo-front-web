"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useClearAuth } from "@/application/stores/useAuthStore";
import { CircleUserRound } from "lucide-react";

export default function UserMenu({ iconColor = "currentColor" }: { iconColor?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const isAuthenticated = useIsAuthenticated();
  const clearAuth = useClearAuth();

  // Esperar a que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    clearAuth();
    closeMenu();
    globalThis.location.href = "/home";
  };

  const handleLogin = () => {
    closeMenu();
    // Redirigir a la pantalla de login
    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // No renderizar hasta que esté montado en el cliente para evitar hydration mismatch
  if (!mounted) {
    return (
      <li className="nav-account">
        <div
          className="link nav-icon-item"
          style={{
            display: "flex",
            alignItems: "center",
            opacity: 0.5,
          }}
        >
          <CircleUserRound width={30} height={30} strokeWidth={0.75} color={iconColor} />
        </div>
      </li>
    );
  }

  return (
    <li className="nav-account" ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={toggleMenu}
        className="link nav-icon-item"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
        title="Mi cuenta"
      >
        <CircleUserRound width={30} height={30} strokeWidth={0.75} color={iconColor} />
      </button>

      {/* Dropdown Menu */}
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minWidth: "200px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {isAuthenticated && (
              <li>
                <Link
                  href="/configurations/address"
                  onClick={closeMenu}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    color: "#333E48",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Configuraciones
                </Link>
              </li>
            )}

            <li>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    color: "#ff3d3d",
                    textDecoration: "none",
                    fontSize: "14px",
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    color: "#333E48",
                    textDecoration: "none",
                    fontSize: "14px",
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
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
