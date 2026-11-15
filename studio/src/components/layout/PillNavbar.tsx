"use client";
import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { BRAND, HERO, NAV, waLink } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Floating glass pill. Top-centre on desktop; on phones it sits at the bottom, in the thumb zone.
export default function PillNavbar() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState("");

  useGSAP(() => {
    gsap.from(ref.current, { yPercent: -140, autoAlpha: 0, duration: 1.2, ease: "expo.out", delay: 0.4 });
    NAV.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(href),
        onLeaveBack: () => href === NAV[0].href && setActive(""),
      });
    });
  }, { scope: ref });

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:bottom-auto md:top-5"
    >
      <nav
        aria-label="Main"
        className="flex w-full max-w-[640px] items-center gap-1 rounded-full border border-white/10 bg-ink/55 p-1.5 pl-5 backdrop-blur-xl backdrop-saturate-150"
      >
        <a href="#top" className="mr-auto flex items-center gap-2 py-2 text-[15px] font-medium tracking-[-0.02em] transition-opacity duration-300 ease-out hover:opacity-70">
          <span aria-hidden="true" className="relative inline-block h-3.5 w-4">
            <span className="absolute left-0 top-0 h-2.5 w-3 rounded-[3px] border border-bone/60" />
            <span className="absolute bottom-0 right-0 h-2.5 w-3 rounded-[3px] border border-copper bg-copper/20" />
          </span>
          {BRAND.name}
        </a>
        <ul className="hidden items-center sm:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                aria-current={active === n.href ? "true" : undefined}
                className={`rounded-full px-3.5 py-2 text-[14px] transition-colors duration-300 ease-out hover:text-bone ${active === n.href ? "bg-white/[0.07] text-bone" : "text-mute"}`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={waLink(HERO.ctaText)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-copper px-4 text-[14px] font-medium text-ink transition-colors duration-300 ease-out hover:bg-copper-2"
        >
          <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
          WhatsApp
        </a>
      </nav>
    </header>
  );
}
