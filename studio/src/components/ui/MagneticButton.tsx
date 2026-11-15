"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "line";
  className?: string;
  external?: boolean;
  strength?: number;
};

// A link that leans toward the cursor and springs back when it leaves. Touch and keyboard get a plain link.
export default function MagneticButton({ href, children, variant = "solid", className = "", external, strength = 0.35 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const ixTo = gsap.quickTo(inner.current, "x", { duration: 0.6, ease: "power3.out" });
    const iyTo = gsap.quickTo(inner.current, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength); yTo(dy * strength);
      ixTo(dx * strength * 0.35); iyTo(dy * strength * 0.35);
    };
    const leave = () => {
      gsap.to([el, inner.current], { x: 0, y: 0, duration: 0.9, ease: "expo.out", overwrite: true });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, { scope: ref });

  const base = "group relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,border-color] duration-300 ease-out";
  const look = variant === "solid"
    ? "bg-copper text-ink hover:bg-copper-2"
    : "border border-white/15 bg-white/[0.04] text-bone backdrop-blur-md hover:border-white/30 hover:bg-white/[0.08]";

  return (
    <a
      ref={ref}
      href={href}
      className={`${base} ${look} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span ref={inner} className="inline-flex items-center gap-2">{children}</span>
    </a>
  );
}
