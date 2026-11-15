"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { HERO, waLink } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { heroState } from "@/lib/heroState";

// three.js only loads in the browser, after the poster and the headline are on screen.
const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), { ssr: false });

// If WebGL throws, the poster simply stays.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [scene, setScene] = useState<null | { mobile: boolean }>(null);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // Stop drawing the scene while the hero is off screen, so the rest of the page stays light.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Decide once on the client: reduced motion, Data Saver or no WebGL keep the still poster.
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (prefersReducedMotion() || nav.connection?.saveData || !canUseWebGL()) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const id = window.setTimeout(() => setScene({ mobile }), mobile ? 600 : 150);
    return () => window.clearTimeout(id);
  }, []);

  useGSAP(() => {
    // Entrance choreography per breakpoint; reduced motion leaves everything in place.
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) return;
      gsap.from(".hero-line > span", { yPercent: 100, duration: desktop ? 1.3 : 1.05, ease: "expo.out", stagger: 0.06, delay: 0.15 });
      gsap.from(".hero-fade", { y: desktop ? 18 : 12, autoAlpha: 0, duration: desktop ? 1.1 : 0.9, ease: "power3.out", stagger: 0.08, delay: desktop ? 0.55 : 0.4 });
    });

    // The scroll film: progress 0 → 1 over the pinned stretch, back to 0 when scrolling up.
    // The section is taller than the screen and its stage is sticky, so the page keeps scrolling normally.
    ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
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
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative h-[165svh] md:h-[210svh]"
      style={{ ["--p" as string]: 0 }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Poster first: always in the page, the scene fades in over it once it has drawn a frame */}
        <picture>
          <source media="(max-width: 767px)" srcSet="/hero-poster-m.webp" />
          <img
            src="/hero-poster.webp"
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

        {/* Scrim keeps the headline at full contrast over the glass */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(9_9_11/0)_22%,rgb(9_9_11/0.8)_48%,rgb(9_9_11/0.92)_100%)] md:bg-[linear-gradient(90deg,rgb(9_9_11/0.9)_0%,rgb(9_9_11/0.55)_38%,rgb(9_9_11/0)_62%)]" />

        <div className="relative z-10 mx-auto grid h-full max-w-[1440px] grid-cols-12 gap-6 px-5 pb-28 pt-24 md:px-10 md:pb-14 md:pt-32">
          <div className="col-span-12 flex flex-col justify-end md:col-span-7 md:justify-center">
            <p className="hero-fade micro mb-5 text-bone/60 max-md:[@media(max-height:760px)]:hidden md:mb-6">{HERO.eyebrow}</p>
            <h1 id="hero-title" className="display text-[clamp(2.6rem,9.5vw,6.5rem)] text-bone">
              {HERO.lines.map((l, i) => (
                <span key={l} className="hero-line mask">
                  <span className={i === 2 ? "italic text-copper-2" : undefined}>{l}</span>
                </span>
              ))}
            </h1>
            <p className="hero-fade mt-5 max-w-[46ch] text-[16px] md:mt-7 leading-[1.6] text-bone/75 md:text-[17px]">{HERO.lead}</p>
            <div className="hero-fade mt-7 flex flex-wrap md:mt-9 items-center gap-3">
              <MagneticButton href={waLink(HERO.ctaText)} external>
                <MessageCircle size={18} aria-hidden="true" />
                {HERO.cta}
              </MagneticButton>
              <MagneticButton href="#pricing" variant="line">
                {HERO.secondary}
                <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </MagneticButton>
            </div>
            <ul className="hero-fade micro mt-7 max-md:[@media(max-height:760px)]:hidden flex md:mt-10 flex-wrap gap-x-6 gap-y-2 text-bone/60">
              {HERO.meta.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
        </div>

        {/* Scroll cue and film progress */}
        <div aria-hidden="true" className="absolute bottom-10 right-10 z-10 hidden items-center gap-3 md:flex">
          <span className="micro text-bone/60">Scroll</span>
          <span className="relative block h-px w-24 overflow-hidden bg-white/15">
            <span className="absolute inset-0 origin-left bg-copper" style={{ transform: "scaleX(var(--p))" }} />
          </span>
          <ArrowDown size={14} className="text-bone/60" />
        </div>
      </div>
    </section>
  );
}
