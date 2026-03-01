"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Promise compartida a nivel de módulo: Bootstrap se importa una sola vez
// sin importar cuántas veces se monte ClientLayout o cambie la ruta.
let bootstrapPromise: Promise<any> | null = null;

function getBootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = import("bootstrap/dist/js/bootstrap.esm.js");
  }
  return bootstrapPromise;
}

function closeModalsAndOffcanvas(bs: any) {
  for (const el of document.querySelectorAll(".modal.show")) {
    bs.Modal.getInstance(el)?.hide();
  }
  for (const el of document.querySelectorAll(".offcanvas.show")) {
    bs.Offcanvas.getInstance(el)?.hide();
  }
}

export default function ClientLayout() {
  const pathname = usePathname();
  const wowRef = useRef<any>(null);

  const skipEcommerceEffects =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/configurations") ||
    pathname.startsWith("/orders");

  // Bootstrap: una Promise compartida garantiza una sola descarga.
  // En cada navegación solo espera la Promise ya resuelta (instantáneo).
  useEffect(() => {
    if (skipEcommerceEffects) return;
    void getBootstrap().then(closeModalsAndOffcanvas);
  }, [pathname, skipEcommerceEffects]);

  // Scroll unificado: header + botón goTop + progress ring en un solo listener
  useEffect(() => {
    if (skipEcommerceEffects) return;

    const header = document.querySelector<HTMLElement>("header");
    const goTop = document.getElementById("goTop");
    const borderProgress = document.querySelector<HTMLElement>(".border-progress");

    let lastScrollTop = 0;
    const delta = 5;
    let ticking = false;

    const checkScroll = () => {
      const scrollTop = window.scrollY;

      // Header hide/show
      if (header) {
        const navbarHeight = header.offsetHeight;
        if (Math.abs(lastScrollTop - scrollTop) > delta) {
          if (scrollTop > navbarHeight) {
            header.style.top = scrollTop > lastScrollTop ? `-${navbarHeight}px` : "0";
            header.classList.toggle("header-bg", scrollTop <= lastScrollTop);
          } else {
            header.style.top = "";
            header.classList.remove("header-bg");
          }
        }
      }

      // Botón ir arriba
      if (goTop) goTop.classList.toggle("show", scrollTop > 100);

      // Progress ring
      if (borderProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          borderProgress.style.setProperty(
            "--progress-angle",
            `${(scrollTop / docHeight) * 360}deg`
          );
        }
      }

      lastScrollTop = scrollTop;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        globalThis.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    globalThis.addEventListener("scroll", handleScroll, { passive: true });
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, [pathname, skipEcommerceEffects]);

  // WOW animations
  useEffect(() => {
    if (skipEcommerceEffects) return;

    if (!wowRef.current) {
      void import("@/shared/utils/wow").then((module) => {
        const WOW = module.default;
        wowRef.current = new WOW({ mobile: false, live: false });
        wowRef.current.init();
      });
    } else {
      wowRef.current.sync();
    }
  }, [pathname, skipEcommerceEffects]);

  return null;
}
