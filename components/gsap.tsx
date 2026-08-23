"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function ensureRegistration() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  once?: boolean;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 36,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ensureRegistration();
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      return;
    }

    try {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      }, el);
      return () => ctx.revert();
    } catch {
      el.style.opacity = "1";
    }
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  selector?: string;
  staggerDelay?: number;
}

export function StaggerGroup({
  children,
  className,
  selector = "[data-stagger]",
  staggerDelay = 0.12,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistration();
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;

    if (prefersReduced) {
      targets.forEach((t) => ((t as HTMLElement).style.opacity = "1"));
      return;
    }

    try {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 42, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: staggerDelay,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }
        );
      }, el);
      return () => ctx.revert();
    } catch {
      targets.forEach((t) => ((t as HTMLElement).style.opacity = "1"));
    }
  }, [selector, staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureRegistration();
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const format = (n: number) =>
      Math.round(n)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    if (prefersReduced) {
      el.textContent = `${prefix}${format(value)}${suffix}`;
      return;
    }

    try {
      const state = { n: 0 };
      const ctx = gsap.context(() => {
        gsap.to(state, {
          n: value,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${format(state.n)}${suffix}`;
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }, el);
      return () => ctx.revert();
    } catch {
      el.textContent = `${prefix}${format(value)}${suffix}`;
    }
  }, [value, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

export function useParallax(
  targetSelector: string,
  distance = 80
): React.RefObject<HTMLDivElement | null> {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistration();
    const scope = scopeRef.current;
    if (!scope) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const targets = scope.querySelectorAll(targetSelector);
      targets.forEach((t) => {
        gsap.fromTo(
          t,
          { y: -distance * 0.5 },
          {
            y: distance * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, scope);
    return () => ctx.revert();
  }, [targetSelector, distance]);

  return scopeRef;
}
