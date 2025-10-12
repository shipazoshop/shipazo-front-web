"use client";
import Context from "@/application/context/Context";
import QueryProvider from "@/application/providers/QueryProvider";
import Cart from "@/presentation/components/modals/Cart";
import Compare from "@/presentation/components/modals/Compare";
import Login from "@/presentation/components/modals/Login";
import MobileMenu from "@/presentation/components/modals/MobileMenu";
import NewsLetter from "@/presentation/components/modals/NewsLetter";
import Quickview from "@/presentation/components/modals/Quickview";
import Register from "@/presentation/components/modals/Register";
import ScrollTop from "@/presentation/components/common/ScrollTop";
import Search from "@/presentation/components/modals/Search";
import Toolbar from "@/presentation/components/modals/Toolbar";
import AddParallax from "@/shared/utils/AddParallax";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    void import("bootstrap/dist/js/bootstrap.esm.js");
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const delta = 5;
    let navbarHeight = 0;
    let didScroll = false;
    const header = document.querySelector<HTMLElement>("header");

    const handleScroll = (): void => {
      didScroll = true;
    };

    const checkScroll = (): void => {
      if (!didScroll || !header) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      navbarHeight = header.offsetHeight;

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

    if (header) {
      navbarHeight = header.offsetHeight;
    }

    window.addEventListener("scroll", handleScroll);
    const scrollInterval = window.setInterval(checkScroll, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(scrollInterval);
    };
  }, [pathname]);

  useEffect(() => {
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
    void import("@/shared/utils/wow").then((module) => {
      const WOW = module.default;
      const wow = new WOW({
        mobile: false,
        live: false,
      });
      wow.init();
    });
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/helvetica-neue-55" rel="stylesheet" />
      </head>
      <body>
        <div id="wrapper">
          <QueryProvider>
            <Context>
              {children}
              <Login />
              <Register />
              <Cart />
              <Quickview />
              <Compare />
              <MobileMenu />
              <ScrollTop />
              <Toolbar />
              <Search />
              <NewsLetter />
              <AddParallax />
            </Context>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
