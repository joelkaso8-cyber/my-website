"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { RIBBON, workUrl } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// A concave ribbon of real demo sites, bent around the viewer like a panoramic screen.
// Drag it, swipe it, use a sideways trackpad gesture or the arrow buttons; it glides with inertia.
// Vertical wheel scrolling is never captured: the page scrolls as normal and only nudges the ribbon.
export default function CurvedGallery() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const api = useRef<{ step: (dir: number) => void; focus: (i: number) => void }>({ step: () => {}, focus: () => {} });

  useGSAP(() => {
    const el = stage.current!;
    const n = RIBBON.length;
    const reduce = prefersReducedMotion();
    let R = 1100, step = 26, cardW = 440;
    let rot = 0, target = 0, vel = 0, scrollRot = 0;
    let dragging = false, lastX = 0, moved = 0;

    const measure = () => {
      const w = el.clientWidth;
      cardW = Math.min(460, Math.max(250, w * (w < 768 ? 0.74 : 0.34)));
      R = Math.max(cardW * 1.9, w * 0.85);
      step = (2 * Math.atan(cardW / 2 / R) * 180) / Math.PI + (w < 768 ? 4 : 3);
      el.style.setProperty("--card-w", `${cardW}px`);
      el.style.perspective = `${Math.max(R * 1.15, 900)}px`;
    };

    const wrap = (a: number) => {
      const span = n * step;
      return ((((a + span / 2) % span) + span) % span) - span / 2;
    };

    const render = () => {
      const total = rot + scrollRot;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const a = wrap(i * step - (n - 1) * step * 0.5 + total);
        const abs = Math.abs(a);
        c.style.transform = `translate(-50%, -50%) translateZ(${R}px) rotateY(${a}deg) translateZ(${-R}px)`;
        c.style.opacity = String(abs > 72 ? 0 : 1 - Math.max(0, abs - 40) / 32);
        c.style.visibility = abs > 74 ? "hidden" : "visible";
        c.style.zIndex = String(100 - Math.round(abs));
      });
    };

    const tick = () => {
      if (!dragging) {
        target += vel;
        vel *= 0.92;
        if (Math.abs(vel) < 0.001) vel = 0;
      }
      rot += (target - rot) * (reduce ? 1 : 0.12);
      render();
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true; moved = 0; lastX = e.clientX; vel = 0;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      const d = (dx / cardW) * step * 0.9;
      target += d; vel = d;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    // A drag should not open the card it ended on.
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } moved = 0; };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical: leave it to the page
      e.preventDefault();
      vel -= e.deltaX * 0.012;
    };

    api.current.step = (dir) => { vel = 0; target = Math.round((target - dir * step) / step) * step; };
    api.current.focus = (i) => {
      const a = wrap(i * step - (n - 1) * step * 0.5 + rot + scrollRot);
      if (Math.abs(a) > step * 0.5) { vel = 0; target -= a; }
    };

    measure(); render();
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    el.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("resize", measure);
    gsap.ticker.add(tick);

    // The ribbon drifts a little as the section passes, so it feels alive without being touched.
    if (!reduce) {
      ScrollTrigger.create({
        trigger: root.current, start: "top bottom", end: "bottom top",
        onUpdate: (s) => { scrollRot = (0.5 - s.progress) * step * 2.2; },
      });
      gsap.from(".ribbon-head > *", {
        y: 30, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }

    return () => {
      gsap.ticker.remove(tick);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("wheel", wheel);
      window.removeEventListener("resize", measure);
    };
  }, { scope: root });

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative overflow-x-clip py-24 md:py-36">
      <div className="ribbon-head mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-5 md:px-10">
        <p className="micro col-span-12 text-bone/60 md:col-span-3 md:pt-4">(00) Selected demos</p>
        <h2 id="work-title" className="display col-span-12 text-[clamp(2.5rem,6vw,5rem)] md:col-span-6">
          Built for the places <span className="italic text-bone/60">people travel for.</span>
        </h2>
        <div className="col-span-12 flex items-end justify-between gap-6 md:col-span-3 md:flex-col md:items-end md:justify-end">
          <p className="max-w-[34ch] text-[15px] text-bone/70 md:text-right">
            Demo sites I designed to show what each package does. Drag the ribbon, or open one: they all work.
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" aria-label="Previous site" onClick={() => api.current.step(-1)} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md transition-all duration-300 ease-out hover:border-white/35 hover:bg-white/[0.09]">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next site" onClick={() => api.current.step(1)} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md transition-all duration-300 ease-out hover:border-white/35 hover:bg-white/[0.09]">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={stage}
        className="relative mt-14 h-[clamp(300px,52vw,520px)] cursor-grab touch-pan-y select-none active:cursor-grabbing md:mt-20"
        style={{ transformStyle: "preserve-3d", ["--card-w" as string]: "440px" }}
      >
        <ul className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {RIBBON.map((w, i) => (
            <li
              key={w.id}
              ref={(n) => { cards.current[i] = n; }}
              className="absolute left-1/2 top-1/2 w-[var(--card-w)] will-change-transform [backface-visibility:hidden]"
            >
              <a
                href={workUrl(w.id)}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                onFocus={() => api.current.focus(i)}
                className="group block rounded-[18px] border border-white/10 bg-white/[0.04] p-2 backdrop-blur-md transition-[border-color,background-color] duration-300 ease-out hover:border-white/25 hover:bg-white/[0.07]"
              >
                <div className="relative overflow-hidden rounded-[12px]">
                  <img
                    src={`/work/${w.id}-desk-600.webp`}
                    srcSet={`/work/${w.id}-desk-600.webp 600w, /work/${w.id}-desk.webp 1200w`}
                    sizes="(max-width: 767px) 74vw, 460px"
                    alt={`${w.name} homepage, a demo website for a ${w.kind.toLowerCase()} in ${w.where}`}
                    width={600}
                    height={375}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="micro absolute left-3 top-3 rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 text-bone backdrop-blur-md">{w.tag}</span>
                </div>
                <div className="flex items-center justify-between gap-3 px-2 pb-1.5 pt-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-medium tracking-[-0.01em]">{w.name}</h3>
                    <p className="micro mt-0.5 truncate text-bone/60">{w.kind} · {w.where}</p>
                  </div>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-bone/50 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-copper-2" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
