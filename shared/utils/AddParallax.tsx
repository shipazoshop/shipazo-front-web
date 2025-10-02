"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type SimpleParallaxOptions = {
  delay?: number;
  orientation?: string;
  scale?: number;
  transition?: string;
  customContainer?: string;
  customWrapper?: string;
};

type SimpleParallaxConstructor = new (
  element: Element,
  options?: SimpleParallaxOptions
) => void;

const defaultOptions: SimpleParallaxOptions = {
  delay: 0.5,
  orientation: "up",
  scale: 1.3,
  transition: "cubic-bezier(0.2, 0.8, 1, 1)",
  customContainer: "",
  customWrapper: "",
};

const AddParallax = (): null => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    void import("simple-parallax-js/vanilla").then((module) => {
      const SimpleParallax = module.default as SimpleParallaxConstructor;
      const elements = document.querySelectorAll(".effect-paralax");
      if (!elements.length) {
        return;
      }
      elements.forEach((element) => {
        new SimpleParallax(element, defaultOptions);
      });
    });
  }, [pathname]);

  return null;
};

export default AddParallax;
