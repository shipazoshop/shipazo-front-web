"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ClientLayout() {
  const pathname = usePathname();
  const bootstrapRef = useRef<any>(null);
  const wowRef = useRef<any>(null);

  // Bootstrap - Load only once on mount
  useEffect(() => {
    if (globalThis.window !== undefined && !bootstrapRef.current) {
      void import("bootstrap/dist/js/bootstrap.esm.js").then((bootstrap) => {
        bootstrapRef.current = bootstrap;
      });
    }
  }, []);

  // Close modals on navigation - Reuse cached Bootstrap instance
  useEffect(() => {
    if (bootstrapRef.current) {
      closeModalsAndOffcanvas(bootstrapRef.current);
    } else {
      // If bootstrap not loaded yet, wait for it
      void import("bootstrap/dist/js/bootstrap.esm.js").then((bootstrap) => {
        bootstrapRef.current = bootstrap;
        closeModalsAndOffcanvas(bootstrap);
      });
    }
  }, [pathname]);

  // Header scroll behavior - Optimized with requestAnimationFrame
  useEffect(() => {
    let lastScrollTop = 0;
    const delta = 5;
    let ticking = false;
    const header = document.querySelector<HTMLElement>("header");

    const checkScroll = () => {
      if (!header) return;

      const scrollTop = window.scrollY;
      const navbarHeight = header.offsetHeight;

      if (Math.abs(lastScrollTop - scrollTop) <= delta) {
        ticking = false;
        return;
      }

      if (scrollTop > navbarHeight) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          header.style.top = `-${navbarHeight}px`;
        } else {
          // Scrolling up
          header.style.top = "0";
          header.classList.add("header-bg");
        }
      } else {
        header.style.top = "";
        header.classList.remove("header-bg");
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

    return () => {
      globalThis.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // WOW animations - Load only once on mount
  useEffect(() => {
    if (globalThis.window !== undefined && !wowRef.current) {
      void import("@/shared/utils/wow").then((module) => {
        const WOW = module.default;
        wowRef.current = new WOW({ mobile: false, live: false });
        wowRef.current.init();
      });
    } else if (wowRef.current) {
      // Re-sync WOW on navigation (lightweight operation)
      wowRef.current.sync();
    }
  }, [pathname]);

  return null;
}

// Helper function to close modals and offcanvas
function closeModalsAndOffcanvas(bootstrapModule: any) {
  const modalElements = document.querySelectorAll(".modal.show");
  for (const modal of modalElements) {
    const modalInstance = bootstrapModule.Modal.getInstance(modal);
    modalInstance?.hide();
  }

  const offcanvasElements = document.querySelectorAll(".offcanvas.show");
  for (const offcanvas of offcanvasElements) {
    const offcanvasInstance = bootstrapModule.Offcanvas.getInstance(offcanvas);
    offcanvasInstance?.hide();
  }
}
