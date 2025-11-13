import LoginForm from "@/presentation/components/auth/LoginForm";
import React from "react";

export const metadata = {
  title: "Iniciar Sesión || shipazo - Multipurpose React Nextjs eCommerce",
  description: "Inicia sesión en shipazo con tu cuenta de Google",
};

export default function LoginPage() {
  return (
    <div className="tf-page-login">
      <div className="container-login">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
