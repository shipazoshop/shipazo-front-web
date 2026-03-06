"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

// Toolbar: carga prioritaria e independiente, no comparte Suspense con modales pesados
const Toolbar = dynamic(() => import("@/presentation/components/modals/Toolbar"), {
  ssr: false,
  loading: () => (
    <div
      className="tf-toolbar-bottom d-xl-none"
      style={{ visibility: "hidden" }}
      aria-hidden="true"
    />
  ),
});

// Modales pesados: se descargan en segundo plano, no bloquean el Toolbar
const Cart = dynamic(() => import("@/presentation/components/modals/Cart"), { ssr: false });
const Quickview = dynamic(() => import("@/presentation/components/modals/Quickview"), { ssr: false });
const Compare = dynamic(() => import("@/presentation/components/modals/Compare"), { ssr: false });
const Register = dynamic(() => import("@/presentation/components/modals/Register"), { ssr: false });
const MobileMenu = dynamic(() => import("@/presentation/components/modals/MobileMenu"), { ssr: false });
const Search = dynamic(() => import("@/presentation/components/modals/Search"), { ssr: false });
const ScrollTop = dynamic(() => import("@/presentation/components/common/ScrollTop"), { ssr: false });
const AddParallax = dynamic(() => import("@/shared/utils/AddParallax"), { ssr: false });

export default function Modals() {
  const pathname = usePathname();

  // No renderizar en rutas sin header/footer (auth, pantallas fullscreen)
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/configurations') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/home/callback')
  ) {
    return null;
  }

  return (
    <>
      {/* Toolbar con prioridad máxima: su propio Suspense, no espera a los modales */}
      <Suspense fallback={null}>
        <Toolbar />
      </Suspense>

      {/* Modales pesados: se cargan en segundo plano sin bloquear nada visible */}
      <Suspense fallback={null}>
        <Register />
        <Cart />
        <Quickview />
        <Compare />
        <MobileMenu />
        <Search />
        <ScrollTop />
        <AddParallax />
      </Suspense>
    </>
  );
}
