"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export function AnimatePresence({
  dep,
  children,
}: {
  dep: string | number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(el, { opacity: 1 });
      return;
    }
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      ).fromTo(
        el.children[0]?.children ?? [],
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
        },
        "<0.05"
      );
    }, el);
    return () => ctx.revert();
  }, [dep]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
