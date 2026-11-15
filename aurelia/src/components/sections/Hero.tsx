"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, CalendarDays } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { BRAND, HERO } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { heroState } from "@/lib/heroState";
import { canRunScene, SceneBoundary, useOnScreen } from "@/lib/scene";

// three.js only loads in the browser, after the poster and the headline have painted.
const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [scene, setScene] = useState<null | { mobile: boolean }>(null);
  const [ready, setReady] = useState(false);
  const onScreen = useOnScreen(root, "0px");

  useEffect(() => {
    if (!canRunScene()) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const id = window.setTimeout(() => setScene({ mobile }), mobile ? 600 : 150);
    return () => window.clearTimeout(id);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) return;
      gsap.from(".hero-line > span", { yPercent: 105, duration: desktop ? 1.4 : 1.1, ease: "expo.out", stagger: 0.07, delay: 0.2 });
      gsap.from(".hero-fade", { y: desktop ? 18 : 12, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, delay: desktop ? 0.65 : 0.45 });
      // While the film plays, the headline drifts up and softens slightly but never leaves the screen.
      gsap.to(".hero-copy", { yPercent: desktop ? -8 : -4, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });
    });

    // The scroll film: 0 → 1 across the held stretch, back to 0 going up. The section is taller than
    // the screen and its stage is sticky, so the page itself always scrolls normally.
    ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => {
        heroState.progress = self.progress;
        root.current?.style.setProperty("--p", self.progress.toFixed(4));
      },
    });

    const onMove = (e: PointerEvent) => {
      heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); mm.revert(); };
  }, { scope: root });

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative h-[170svh] md:h-[220svh]" style={{ ["--p" as string]: 0 }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Poster first; the live scene fades in over it once its first frame is drawn */}
        <picture>
          <source media="(max-width: 767px)" srcSet="hero-poster-m.webp" />
          <img
            src="hero-poster.webp"
            alt=""
            aria-hidden="true"
            width={1600}
            height={1000}
            fetchPriority="high"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${ready ? "opacity-0" : "opacity-100"}`}
          />
        </picture>
        {scene && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
            <SceneBoundary>
              <HeroScene mobile={scene.mobile} active={onScreen} onReady={() => setReady(true)} />
            </SceneBoundary>
          </div>
        )}

        {/* Scrim: the headline keeps full contrast over the stone */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_9/0)_30%,rgb(10_10_9/0.82)_56%,rgb(10_10_9/0.94)_100%)] md:bg-[linear-gradient(90deg,rgb(10_10_9/0.9)_0%,rgb(10_10_9/0.5)_40%,rgb(10_10_9/0)_64%)]" />

        {/* Coordinates, top corners */}
        <div aria-hidden="true" className="micro absolute inset-x-0 top-0 z-10 mx-auto hidden max-w-[1440px] justify-between px-10 pt-9 text-alabaster/55 md:flex">
          <span>{BRAND.coords}</span>
          <span>{BRAND.region}</span>
        </div>

        <div className="hero-copy relative z-10 mx-auto grid h-full max-w-[1440px] grid-cols-12 gap-6 px-5 pb-28 pt-24 md:px-10 md:pb-16 md:pt-32">
          <div className="col-span-12 flex flex-col justify-end md:col-span-7 md:justify-center">
            <p className="hero-fade micro mb-5 text-gold-2/90 md:mb-7">
              {BRAND.full}
              <span className="text-alabaster/50"> · {BRAND.region}</span>
            </p>
            <h1 id="hero-title" className="display text-[clamp(3rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.03em] text-alabaster">
              {HERO.lines.map((l, i) => (
                <span key={l} className="hero-line mask">
                  <span className={i === HERO.lines.length - 1 ? "italic text-gold-2" : undefined}>{l}</span>
                </span>
              ))}
            </h1>
            <p className="hero-fade mt-6 max-w-[48ch] text-[15px] leading-[1.65] text-alabaster/75 md:mt-8 md:text-[17px] max-md:[@media(max-height:700px)]:hidden">{HERO.lead}</p>
            <div className="hero-fade mt-7 flex flex-wrap items-center gap-3 md:mt-10">
              <MagneticButton href="#reserve">
                <CalendarDays size={18} aria-hidden="true" />
                {HERO.cta}
              </MagneticButton>
              <MagneticButton href="#gastronomy" variant="line">
                {HERO.secondary}
                <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </MagneticButton>
            </div>
            <ul className="hero-fade micro mt-8 flex flex-wrap gap-x-6 gap-y-2 text-alabaster/55 max-md:hidden md:mt-12">
              {HERO.meta.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
        </div>

        {/* Scroll cue doubles as the film's progress line */}
        <div aria-hidden="true" className="absolute bottom-10 right-10 z-10 hidden items-center gap-3 md:flex">
          <span className="micro text-alabaster/55">Scroll · sunset</span>
          <span className="relative block h-px w-28 overflow-hidden bg-white/15">
            <span className="absolute inset-0 origin-left bg-gold" style={{ transform: "scaleX(var(--p))" }} />
          </span>
          <ArrowDown size={14} className="text-alabaster/55" />
        </div>
      </div>
    </section>
  );
}
