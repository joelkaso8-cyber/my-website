"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Photo from "@/components/ui/Photo";
import { RIBBON } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// A concave ribbon of rooms, tables and terraces bent around the viewer like a panorama.
// It glides along its arc as the page scrolls past, and can be dragged, swiped, pushed with a sideways
// trackpad gesture or stepped with the arrows. Vertical wheel scrolling always stays with the page.
export default function CurvedGallery() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const api = useRef<{ step: (dir: number) => void; focus: (i: number) => void }>({ step: () => {}, focus: () => {} });

  useGSAP(() => {
    const el = stage.current!;
    const n = RIBBON.length;
    const reduce = prefersReducedMotion();
    let R = 1100, step = 24, cardW = 400;
    let rot = 0, target = 0, vel = 0, scrollRot = 0;
    let dragging = false, lastX = 0, moved = 0;

    const measure = () => {
      const w = el.clientWidth;
      cardW = Math.min(420, Math.max(240, w * (w < 768 ? 0.68 : 0.27)));
      R = Math.max(cardW * 2.1, w * 0.8);
      step = (2 * Math.atan(cardW / 2 / R) * 180) / Math.PI + (w < 768 ? 4 : 2.5);
      el.style.setProperty("--card-w", `${cardW}px`);
      el.style.perspective = `${Math.max(R * 1.1, 900)}px`;
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
        // translateZ(R) → rotate → translateZ(-R): the card sits on the inside of a cylinder (concave).
        c.style.transform = `translate(-50%, -50%) translateZ(${R}px) rotateY(${a}deg) translateZ(${-R}px)`;
        c.style.opacity = String(abs > 70 ? 0 : 1 - Math.max(0, abs - 38) / 32);
        c.style.visibility = abs > 72 ? "hidden" : "visible";
        c.style.zIndex = String(100 - Math.round(abs));
      });
    };

    const tick = () => {
      if (!dragging) {
        target += vel;
        vel *= 0.92;
        if (Math.abs(vel) < 0.001) vel = 0;
      }
      rot += (target - rot) * (reduce ? 1 : 0.1);
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
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } moved = 0; };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical belongs to the page
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

    if (!reduce) {
      // Vertical scroll carries the ribbon along its arc, about four rooms while the section passes.
      ScrollTrigger.create({
        trigger: root.current, start: "top bottom", end: "bottom top",
        onUpdate: (s) => { scrollRot = (0.5 - s.progress) * step * 4.5; },
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

  const arrow = "grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md transition-all duration-300 ease-out hover:border-gold/60 hover:bg-white/[0.09]";

  return (
    <section ref={root} id="suites" aria-labelledby="suites-title" className="relative overflow-x-clip py-20 md:py-32">
      <div className="ribbon-head mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-5 md:px-10">
        <p className="micro col-span-12 text-alabaster/55 md:col-span-3 md:pt-5">(01) Suites & spaces</p>
        <h2 id="suites-title" className="display col-span-12 text-[clamp(2.6rem,6.4vw,5.6rem)] md:col-span-6">
          Rooms that face <span className="italic text-gold-2">the evening.</span>
        </h2>
        <div className="col-span-12 flex items-end justify-between gap-6 md:col-span-3 md:flex-col md:items-end md:justify-end">
          <p className="max-w-[34ch] text-[15px] text-alabaster/70 md:text-right">
            Nine places in the house, from the panorama suite to the rock cellar. Drag the ribbon or keep scrolling.
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" aria-label="Previous space" onClick={() => api.current.step(-1)} className={arrow}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next space" onClick={() => api.current.step(1)} className={arrow}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={stage}
        className="relative mt-12 h-[clamp(380px,48vw,600px)] cursor-grab touch-pan-y select-none active:cursor-grabbing md:mt-16"
        style={{ transformStyle: "preserve-3d", ["--card-w" as string]: "400px" }}
      >
        <ul className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {RIBBON.map((r, i) => (
            <li
              key={r.id}
              ref={(el) => { cards.current[i] = el; }}
              className="absolute left-1/2 top-1/2 w-[var(--card-w)] will-change-transform [backface-visibility:hidden]"
            >
              <a
                href="#reserve"
                draggable={false}
                onFocus={() => api.current.focus(i)}
                aria-label={`${r.title}, ${r.size}, ${r.rate}. Reserve`}
                className="group block rounded-[20px] border border-white/10 bg-white/[0.04] p-2 backdrop-blur-md transition-[transform,border-color,background-color] duration-500 ease-out hover:-translate-y-4 hover:border-gold/45 hover:bg-white/[0.07] focus-visible:-translate-y-4"
              >
                <div className="relative overflow-hidden rounded-[14px]">
                  <Photo
                    id={r.photo}
                    alt={r.alt}
                    width={800}
                    height={1000}
                    sizes="(max-width: 767px) 68vw, 420px"
                    widths={[480, 840]}
                    className="aspect-[4/5] w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_9/0)_45%,rgb(10_10_9/0.85)_100%)] opacity-70 transition-opacity duration-500 ease-out group-hover:opacity-100" />
                  <span className="micro absolute left-3 top-3 rounded-full border border-white/15 bg-ink/60 px-2.5 py-1 text-alabaster/90 backdrop-blur-md">{r.kind}</span>
                  {/* Metadata rises in on hover / focus */}
                  <dl className="micro absolute inset-x-3 bottom-3 grid translate-y-3 grid-cols-2 gap-y-1 text-alabaster/85 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <dt className="sr-only">Size</dt>
                    <dd>{r.size}</dd>
                    <dt className="sr-only">Rate</dt>
                    <dd className="text-right text-gold-2">{r.rate}</dd>
                  </dl>
                </div>
                <div className="flex items-center justify-between gap-3 px-2 pb-1.5 pt-3">
                  <h3 className="micro truncate text-alabaster/85">
                    <span className="text-gold-2">{String(i + 1).padStart(2, "0")}</span> / {r.title}
                  </h3>
                  <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-alabaster/45 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-2" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
