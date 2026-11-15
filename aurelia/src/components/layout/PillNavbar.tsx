"use client";
import { useRef, useState } from "react";
import { BRAND, NAV } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Floating translucent glass pill. Top-centre on desktop; on phones it sits at the bottom, in the thumb zone.
// "Reserve" is the one gold action and stays visible at every width.
export default function PillNavbar() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState("");
  const links = NAV.slice(0, -1);
  const reserve = NAV[NAV.length - 1];

  useGSAP(() => {
    gsap.from(ref.current, { yPercent: -140, autoAlpha: 0, duration: 1.2, ease: "expo.out", delay: 0.5 });
    NAV.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el, start: "top 55%", end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(href),
        onLeaveBack: () => href === NAV[0].href && setActive(""),
      });
    });
  }, { scope: ref });

  return (
    <header ref={ref} className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:bottom-auto md:top-5">
      <nav aria-label="Main" className="flex w-full max-w-[600px] items-center gap-1 rounded-full border border-white/10 bg-ink/70 p-1.5 pl-5 backdrop-blur-xl backdrop-saturate-150">
        <a href="#top" className="mr-auto flex items-baseline gap-2 py-2 transition-opacity duration-300 ease-out hover:opacity-70">
          <span className="display text-[22px] leading-none tracking-[-0.02em]">{BRAND.name}</span>
          <span className="micro hidden text-[9px] text-alabaster/50 lg:inline">Est. stone</span>
        </a>
        <ul className="flex items-center">
          {links.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                aria-current={active === n.href ? "true" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-2.5 text-[13px] transition-colors duration-300 ease-out hover:text-alabaster sm:px-3.5 sm:text-[14px] ${active === n.href ? "bg-white/[0.08] text-gold-2" : "text-alabaster/70"} ${n.href === "#experiences" ? "max-sm:hidden" : ""}`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={reserve.href}
          aria-current={active === reserve.href ? "true" : undefined}
          className="ml-1 inline-flex min-h-11 items-center rounded-full bg-gold px-4 text-[14px] font-medium text-ink transition-colors duration-300 ease-out hover:bg-gold-2"
        >
          {reserve.label}
        </a>
      </nav>
    </header>
  );
}
