"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import MaskedTitle from "@/components/ui/MaskedTitle";
import Photo from "@/components/ui/Photo";
import { RESTAURANT } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { decanterState } from "@/lib/heroState";
import { canRunScene, SceneBoundary, useOnScreen } from "@/lib/scene";

const DecanterScene = dynamic(() => import("@/components/canvas/DecanterScene"), { ssr: false });

const COURSES = RESTAURANT.courses;
const TINTS = COURSES.map((c) => c.tint);
const STILL = { id: "1585553616435-2dc0a54e271d", alt: "A clear wine glass holding golden wine" };

// Sticky split screen for Hearth. On desktop the stage holds while the page scrolls through four courses:
// the glass decanter turns with the scroll, its wine changes to each pairing, and the menu notes and dish
// photographs crossfade beside it. On phones the courses simply stack, with the decanter above them.
export default function RestaurantShowcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [scene, setScene] = useState<null | { mobile: boolean }>(null);
  const onScreen = useOnScreen(root);

  useEffect(() => {
    if (!canRunScene()) return;
    setScene({ mobile: window.matchMedia("(max-width: 767px)").matches });
  }, []);

  useGSAP(() => {
    const pick = (i: number) => { decanterState.course = i; setActive(i); };
    ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "bottom bottom",
      onUpdate: (s) => { decanterState.progress = s.progress; },
    });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: ".gastro-track", start: "top top", end: "bottom bottom",
        onUpdate: (s) => {
          const i = Math.min(COURSES.length - 1, Math.floor(s.progress * COURSES.length));
          if (i !== decanterState.course) pick(i);
        },
      });
    });
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray<HTMLElement>(".course-card").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && pick(i) });
      });
    });
    gsap.from(".gastro-head > *", { y: 30, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: root.current, start: "top 70%" } });
    return () => mm.revert();
  }, { scope: root });

  const fade = (i: number) => `transition-[opacity,transform] duration-700 ease-out ${i === active ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"}`;

  // Only one canvas is ever mounted: the slot for the current layout. Elsewhere the still photo stays.
  const vessel = (phone: boolean) => {
    const live = !!scene && scene.mobile === phone;
    return (
    <div className="relative h-full w-full">
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}>
        <Photo id={STILL.id} alt={STILL.alt} width={800} height={1000} sizes="(max-width: 767px) 80vw, 30vw" widths={[480, 960]} className="aspect-[4/5] w-3/4 rounded-[20px]" />
      </div>
      {live && (
        <SceneBoundary>
          <DecanterScene mobile={phone} active={onScreen} tints={TINTS} />
        </SceneBoundary>
      )}
    </div>
    );
  };

  return (
    <section ref={root} id="gastronomy" aria-labelledby="gastro-title" className="relative z-10 bg-ink-2/60">
      {/* Desktop: a tall track with a sticky stage */}
      <div className="gastro-track relative hidden h-[460svh] md:block">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="mx-auto grid h-full max-w-[1440px] grid-cols-12 gap-6 px-10 pb-12 pt-28">
            <div className="gastro-head col-span-4 flex flex-col">
              <p className="micro text-alabaster/55">{RESTAURANT.label}</p>
              <MaskedTitle id="gastro-title" lines={RESTAURANT.title} italicLast className="mt-6 text-[clamp(3rem,5.4vw,5.4rem)] font-light" />
              <p className="mt-6 max-w-[40ch] text-[15px] text-alabaster/70">{RESTAURANT.lead}</p>
              <div className="relative mt-auto min-h-[230px]">
                {COURSES.map((c, i) => (
                  <article key={c.n} className={`absolute inset-x-0 bottom-0 border-t border-white/10 pt-6 ${fade(i)}`} aria-hidden={i !== active}>
                    <p className="micro text-gold-2">Course {c.n} · {c.title}</p>
                    <h3 className="display mt-3 text-[clamp(1.8rem,2.4vw,2.4rem)] leading-[1.02]">{c.dish}</h3>
                    <dl className="micro mt-5 grid grid-cols-2 gap-4 text-alabaster/60">
                      <div><dt className="text-alabaster/40">Pairing</dt><dd className="mt-1 text-alabaster/85">{c.pairing}</dd></div>
                      <div><dt className="text-alabaster/40">Note</dt><dd className="mt-1 text-alabaster/85">{c.note}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-span-4 h-full">{vessel(false)}</div>

            <div className="col-span-4 flex flex-col">
              <ol aria-label="Courses" className="flex justify-end gap-2">
                {COURSES.map((c, i) => (
                  <li key={c.n} className={`micro grid size-11 place-items-center rounded-full border transition-colors duration-300 ease-out ${i === active ? "border-gold bg-gold text-ink" : "border-white/15 text-alabaster/60"}`}>
                    {c.n}
                  </li>
                ))}
              </ol>
              <div className="relative mt-auto aspect-[4/5] w-full">
                {COURSES.map((c, i) => (
                  <div key={c.n} className={`absolute inset-0 ${fade(i)}`}>
                    <Photo id={c.photo} alt={c.alt} width={900} height={1125} sizes="30vw" widths={[600, 1000]} className="h-full w-full rounded-[20px] border border-white/10" />
                  </div>
                ))}
              </div>
              <p className="micro mt-4 text-right text-alabaster/55">{RESTAURANT.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phones: stacked courses, no pinning */}
      <div className="py-20 md:hidden">
        <div className="gastro-head px-5">
          <p className="micro text-alabaster/55">{RESTAURANT.label}</p>
          <h2 className="display mt-5 text-[clamp(2.8rem,12vw,4rem)] font-light">
            {RESTAURANT.title[0]} <span className="italic text-gold-2">{RESTAURANT.title[1]}</span>
          </h2>
          <p className="mt-5 text-[15px] text-alabaster/70">{RESTAURANT.lead}</p>
        </div>
        <div className="sticky top-0 z-0 mx-auto h-[46svh] max-w-[420px]">{vessel(true)}</div>
        <ol className="relative z-10 space-y-6 px-5">
          {COURSES.map((c) => (
            <li key={c.n} className="course-card overflow-hidden rounded-[20px] border border-white/10 bg-ink/80 backdrop-blur-md">
              <Photo id={c.photo} alt={c.alt} width={800} height={600} sizes="90vw" widths={[480, 800]} className="aspect-[4/3]" />
              <div className="p-5">
                <p className="micro text-gold-2">Course {c.n} · {c.title}</p>
                <h3 className="display mt-2 text-[1.9rem] leading-[1.02]">{c.dish}</h3>
                <p className="micro mt-4 text-alabaster/60">Pairing · {c.pairing}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="micro mt-8 px-5 text-alabaster/55">{RESTAURANT.price}</p>
      </div>
    </section>
  );
}
