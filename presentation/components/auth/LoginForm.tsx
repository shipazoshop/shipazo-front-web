"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthRepository } from "@/presentation/hooks/repositories/useAuthRepository";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleAuth } = useAuthRepository();
  const searchParams = useSearchParams();

  // Guardar el redirect en sessionStorage si viene en la URL
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      sessionStorage.setItem("redirectAfterLogin", redirect);
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Redirige al usuario a Google para autenticación
    googleAuth();
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <Link href="/" className="login-logo">
            <h2 className="text-center mb-0">shipazo</h2>
          </Link>
          <h4 className="login-title text-center">Bienvenido de nuevo</h4>
          <p className="login-subtitle text-center text-cl-1">
            Inicia sesión con tu cuenta de Google para continuar
          </p>
        </div>

        {/* Login Content */}
        <div className="login-content">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="btn-google-signin"
          >
            <span className="btn-google-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.8055 10.2292C19.8055 9.55056 19.7508 8.86717 19.6324 8.19873H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.825C18.7173 15.8449 19.8055 13.2728 19.8055 10.2292Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.2002 20.0006C12.9507 20.0006 15.2652 19.1151 16.8297 17.5865L13.6072 15.0879C12.7061 15.6979 11.5492 16.0433 10.2049 16.0433C7.54334 16.0433 5.29191 14.2832 4.50297 11.9169H1.17871V14.4927C2.78219 17.6795 6.30992 20.0006 10.2002 20.0006Z"
                  fill="#34A853"
                />
                <path
                  d="M4.49834 11.9169C4.07694 10.675 4.07694 9.33008 4.49834 8.08817V5.51233H1.17875C-0.196911 8.23656 -0.196911 11.7684 1.17875 14.4926L4.49834 11.9169Z"
                  fill="#FBBC04"
                />
                <path
                  d="M10.2002 3.95805C11.6246 3.936 13.0009 4.47247 14.036 5.45722L16.8907 2.60218C15.1783 0.990909 12.9273 0.0813589 10.2002 0.104854C6.30992 0.104854 2.78219 2.42595 1.17871 5.51234L4.49831 8.08818C5.28257 5.71719 7.53867 3.95805 10.2002 3.95805Z"
                  fill="#EA4335"
                />
              </svg>
            </span>
            <span className="btn-google-text">
              {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Inicio de sesión seguro</span>
            <span className="divider-line"></span>
          </div>

          {/* Info Section */}
          <div className="login-info">
            <div className="info-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14Z"
                  fill="currentColor"
                />
                <path
                  d="M10.5 7L7 10.5L5.5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Autenticación segura con Google</span>
            </div>
            <div className="info-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 7V5C12 2.79 10.21 1 8 1C5.79 1 4 2.79 4 5V7C2.9 7 2 7.9 2 9V13C2 14.1 2.9 15 4 15H12C13.1 15 14 14.1 14 13V9C14 7.9 13.1 7 12 7ZM8 11.5C7.17 11.5 6.5 10.83 6.5 10C6.5 9.17 7.17 8.5 8 8.5C8.83 8.5 9.5 9.17 9.5 10C9.5 10.83 8.83 11.5 8 11.5ZM10 7H6V5C6 3.9 6.9 3 8 3C9.1 3 10 3.9 10 5V7Z"
                  fill="currentColor"
                />
              </svg>
              <span>Tus datos están protegidos</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="text-center text-cl-2 caption mb-0">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terms" className="link">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacy" className="link">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="login-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default LoginForm;
