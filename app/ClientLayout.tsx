"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout() {
  const pathname = usePathname();

  useEffect(() => {
    // Bootstrap - solo una vez
    if (typeof window !== "undefined") {
      void import("bootstrap/dist/js/bootstrap.esm.js");
    }
  }, []);

  useEffect(() => {
    // Header scroll behavior
    let lastScrollTop = 0;
    const delta = 5;
    let didScroll = false;
    const header = document.querySelector<HTMLElement>("header");

    const handleScroll = () => {
      didScroll = true;
    };

    const checkScroll = () => {
      if (!didScroll || !header) return;

      const scrollTop = window.scrollY;
      const navbarHeight = header.offsetHeight;

      if (scrollTop > navbarHeight) {
        if (scrollTop > lastScrollTop + delta) {
          header.style.top = `-${navbarHeight}px`;
        } else if (scrollTop < lastScrollTop - delta) {
          header.style.top = "0";
          header.classList.add("header-bg");
        }
      } else {
        header.style.top = "";
        header.classList.remove("header-bg");
      }

      lastScrollTop = scrollTop;
      didScroll = false;
    };

    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(checkScroll, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [pathname]);

  useEffect(() => {
    // Close modals on navigation
    void import("bootstrap").then((bootstrapModule) => {
      const modalElements = document.querySelectorAll(".modal.show");
      modalElements.forEach((modal) => {
        const modalInstance = bootstrapModule.Modal.getInstance(modal);
        modalInstance?.hide();
      });

      const offcanvasElements = document.querySelectorAll(".offcanvas.show");
      offcanvasElements.forEach((offcanvas) => {
        const offcanvasInstance = bootstrapModule.Offcanvas.getInstance(offcanvas);
        offcanvasInstance?.hide();
      });
    });
  }, [pathname]);

  useEffect(() => {
    // WOW animations
    void import("@/shared/utils/wow").then((module) => {
      const WOW = module.default;
      const wow = new WOW({ mobile: false, live: false });
      wow.init();
    });
  }, [pathname]);

  return null;
}
