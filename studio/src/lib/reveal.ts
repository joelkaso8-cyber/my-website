"use client";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

// Shared scroll reveals inside a section:
//  .mask > span  → display lines slide up out of their mask (yPercent 100 → 0, stagger 0.06)
//  [data-rise]   → body copy and cards lift in
//  [data-rule]   → hairline dividers draw from the left
export function revealIn(scope: Element) {
  if (prefersReducedMotion()) return;
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll("[data-reveal]")).forEach((block) => {
    const lines = block.querySelectorAll(".mask > span");
    if (lines.length)
      gsap.from(lines, { yPercent: 100, duration: 1.2, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: block, start: "top 82%" } });
  });
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll("[data-rise]")).forEach((el) => {
    gsap.from(el, { y: 36, autoAlpha: 0, duration: 1.1, ease: "power3.out", delay: Number(el.dataset.rise || 0) * 0.06, scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll("[data-rule]")).forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 92%" } });
  });
}
