"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// The oversized footer wordmark. A pool of molten gold follows the pointer through the letters,
// trailing a little behind it. With no pointer (phones, keyboard) the light drifts slowly on its own.
export default function GoldWordmark({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const pos = { x: 50, y: 50, r: 0 };
    const apply = () => {
      el.style.setProperty("--gx", `${pos.x}%`);
      el.style.setProperty("--gy", `${pos.y}%`);
      el.style.setProperty("--gr", `${pos.r}`);
    };
    apply();
    if (prefersReducedMotion()) { pos.r = 1; apply(); return; }

    const xTo = gsap.quickTo(pos, "x", { duration: 0.9, ease: "power3.out", onUpdate: apply });
    const yTo = gsap.quickTo(pos, "y", { duration: 0.9, ease: "power3.out", onUpdate: apply });

    // Idle drift: a slow figure-eight across the word until someone points at it.
    const drift = gsap.timeline({ repeat: -1, yoyo: true, onUpdate: apply })
      .to(pos, { x: 85, y: 35, duration: 4.5, ease: "sine.inOut" })
      .to(pos, { x: 15, y: 65, duration: 6, ease: "sine.inOut" });
    gsap.to(pos, { r: 0.75, duration: 1.6, ease: "power3.out", onUpdate: apply,
      scrollTrigger: { trigger: el, start: "top 90%" } });

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      drift.pause();
      const b = el.getBoundingClientRect();
      xTo(((e.clientX - b.left) / b.width) * 100);
      yTo(((e.clientY - b.top) / b.height) * 100);
      gsap.to(pos, { r: 1, duration: 0.6, ease: "power3.out", overwrite: "auto", onUpdate: apply });
    };
    const leave = () => {
      gsap.to(pos, { r: 0.75, duration: 1.2, ease: "power3.out", onUpdate: apply });
      drift.invalidate().restart();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, { scope: root });

  const gold =
    "radial-gradient(calc(var(--gr) * 34vw) calc(var(--gr) * 22vw) at var(--gx) var(--gy), #fff3d6 0%, #f2cf8f 14%, #d9a45a 30%, #a8693a 48%, rgb(120 72 40 / 0) 70%)";

  return (
    <div ref={root} aria-hidden="true" className="relative mt-16 cursor-default select-none md:mt-10">
      <p className="display whitespace-nowrap text-center text-[22vw] leading-[0.8] text-white/[0.05]">{text}</p>
      <p
        className="display pointer-events-none absolute inset-0 whitespace-nowrap text-center text-[22vw] leading-[0.8] text-transparent"
        style={{ backgroundImage: gold, WebkitBackgroundClip: "text", backgroundClip: "text" }}
      >
        {text}
      </p>
      {/* Soft glow under the letters, same light source */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen blur-3xl"
        style={{ backgroundImage: "radial-gradient(calc(var(--gr) * 18vw) calc(var(--gr) * 12vw) at var(--gx) var(--gy), rgb(217 164 90 / 0.18), transparent 70%)" }}
      />
    </div>
  );
}
