"use client";

import { useEffect, useRef, useState } from "react";

export default function LazySection({
  children,
  fallback = null,
  rootMargin = "200px 0px",
  once = true,
  wrapperClassName = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || (once && isVisible)) {
      return;
    }

    let observer;

    const node = hostRef.current;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { rootMargin }
      );
      observer.observe(node);
    } catch (error) {
      setIsVisible(true);
    }

    return () => {
      if (observer && node) {
        try {
          observer.unobserve(node);
        } catch (_) {
          // ignore cleanup issues in unsupported environments
        }
        observer.disconnect();
      }
    };
  }, [rootMargin, once, isVisible]);

  return (
    <div ref={hostRef} className={wrapperClassName}>
      {isVisible ? children : fallback}
    </div>
  );
}
