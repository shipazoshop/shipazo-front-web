"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

// Lazy load modals - se cargan solo cuando se abren
const Cart = dynamic(() => import("@/presentation/components/modals/Cart"), {
  ssr: false,
});
const Quickview = dynamic(() => import("@/presentation/components/modals/Quickview"), {
  ssr: false,
});
const Compare = dynamic(() => import("@/presentation/components/modals/Compare"), {
  ssr: false,
});
const Login = dynamic(() => import("@/presentation/components/modals/Login"), {
  ssr: false,
});
const Register = dynamic(() => import("@/presentation/components/modals/Register"), {
  ssr: false,
});
const MobileMenu = dynamic(() => import("@/presentation/components/modals/MobileMenu"), {
  ssr: false,
});
const Search = dynamic(() => import("@/presentation/components/modals/Search"), {
  ssr: false,
});
const Toolbar = dynamic(() => import("@/presentation/components/modals/Toolbar"), {
  ssr: false,
});

// Componentes que pueden esperar
const ScrollTop = dynamic(() => import("@/presentation/components/common/ScrollTop"), {
  ssr: false,
});
const AddParallax = dynamic(() => import("@/shared/utils/AddParallax"), {
  ssr: false,
});

export default function Modals() {
  const pathname = usePathname();

  // No cargar modals de e-commerce en rutas de admin y configurations
  if (pathname.startsWith('/admin') || pathname.startsWith('/configurations')) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Login />
      <Register />
      <Cart />
      <Quickview />
      <Compare />
      <MobileMenu />
      <ScrollTop />
      <Toolbar />
      <Search />
      <AddParallax />
    </Suspense>
  );
}
