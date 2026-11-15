"use client";
import { useRef } from "react";
import MaskedTitle from "@/components/ui/MaskedTitle";
import Photo from "@/components/ui/Photo";
import { EXPERIENCES, STORY } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealIn } from "@/lib/reveal";

// The editorial chapter on warm alabaster: an asymmetric 12-column spread with masked line reveals,
// hairline rules and photographs drifting at different speeds.
export default function SanctuaryStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    revealIn(root.current!);
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = Number(el.dataset.speed) * (desktop ? 1 : 0.4);
        gsap.fromTo(el, { yPercent: 12 * s }, { yPercent: -12 * s, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // Inner zoom: each photo settles from 1.15 to 1 as it crosses the screen
      gsap.utils.toArray<HTMLElement>(".story-photo img").forEach((img) => {
        gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  const [p1, p2, p3] = STORY.photos;

  return (
    <section ref={root} id="sanctuary" aria-labelledby="story-title" className="on-light relative z-10 bg-alabaster py-28 text-ink md:py-40">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-5 md:px-10">
        <div data-rule className="col-span-12 h-px bg-black/10" />
        <p data-rise className="micro col-span-12 text-ink/55 md:col-span-3">{STORY.label}</p>
        <MaskedTitle
          id="story-title"
          lines={STORY.title}
          italicLast
          italicClass="italic text-gold-ink"
          className="col-span-12 text-[clamp(2.8rem,7.4vw,7rem)] font-light md:col-span-9"
        />

        {/* Tall photo left, copy offset right */}
        <div className="col-span-12 md:col-span-5 md:row-span-2 md:mt-10">
          <div data-speed="0.6">
            <Photo id={p1.id} alt={p1.alt} width={p1.w} height={p1.h} sizes="(max-width: 767px) 90vw, 40vw" className="story-photo aspect-[4/5] rounded-[20px]" />
          </div>
          <p data-rise className="micro mt-4 text-ink/50">Fig. 1 · The south wall at 18:40</p>
        </div>
        <p data-rise className="col-span-12 max-w-[62ch] text-[17px] leading-[1.7] text-ink/80 md:col-span-4 md:col-start-7 md:mt-16">{STORY.a}</p>
        <p data-rise="1" className="col-span-12 max-w-[62ch] text-[17px] leading-[1.7] text-ink/80 md:col-span-4 md:col-start-8 md:mt-2">{STORY.b}</p>

        {/* Numbers in a ruled row */}
        <dl className="col-span-12 grid grid-cols-3 border-y border-black/10 md:col-span-7 md:col-start-6 md:mt-8">
          {STORY.numbers.map((n, i) => (
            <div key={n.l} data-rise={i} className={`flex flex-col-reverse py-6 md:py-8 ${i ? "border-l border-black/10 pl-4 md:pl-6" : ""}`}>
              <dt className="micro mt-2 text-ink/55">{n.l}</dt>
              <dd className="display text-[clamp(2.2rem,4.6vw,4rem)] font-light">{n.n}</dd>
            </div>
          ))}
        </dl>

        {/* Wide landscape photo across, a small portrait tucked over its edge */}
        <div className="relative col-span-12 mt-6 md:col-span-8 md:col-start-2 md:mt-20">
          <div data-speed="0.3">
            <Photo id={p2.id} alt={p2.alt} width={p2.w} height={p2.h} sizes="(max-width: 767px) 90vw, 62vw" className="story-photo aspect-[7/5] rounded-[20px]" />
          </div>
          <p data-rise className="micro mt-4 text-ink/50">Fig. 2 · Cistern pool and the lower terraces</p>
        </div>
        <div className="col-span-8 col-start-5 md:col-span-3 md:col-start-10 md:-mt-48">
          <div data-speed="1.1">
            <Photo id={p3.id} alt={p3.alt} width={p3.w} height={p3.h} sizes="(max-width: 767px) 60vw, 24vw" className="story-photo aspect-[4/5] rounded-[20px] border border-black/10" />
          </div>
        </div>

        {/* Facts index */}
        <ol className="col-span-12 md:col-span-9 md:col-start-4 md:mt-16">
          {STORY.facts.map((f, i) => (
            <li key={f.k}>
              <div data-rule className="h-px bg-black/10" />
              <div className="grid grid-cols-12 items-baseline gap-x-6 py-7 md:py-9">
                <span className="micro col-span-2 text-ink/45">0{i + 1}</span>
                <h3 className="display col-span-10 text-[clamp(2rem,3.6vw,3.2rem)] md:col-span-4">{f.k}</h3>
                <p className="col-span-10 col-start-3 max-w-[52ch] text-ink/75 md:col-span-6">{f.v}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Experiences: a timetable of the day */}
        <div id="experiences" className="col-span-12 mt-10 scroll-mt-24 md:mt-24">
          <div data-rule className="h-px bg-black/10" />
          <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-8">
            <p data-rise className="micro col-span-12 text-ink/55 md:col-span-3">{EXPERIENCES.label}</p>
            <ul className="col-span-12 grid gap-px overflow-hidden rounded-[20px] border border-black/10 bg-black/10 sm:grid-cols-2 md:col-span-9">
              {EXPERIENCES.items.map((x, i) => (
                <li key={x.k} data-rise={i} className="group bg-alabaster p-6 transition-colors duration-300 ease-out hover:bg-sand md:p-8">
                  <p className="micro text-gold-ink">{x.t}</p>
                  <h3 className="display mt-3 text-[clamp(1.9rem,2.8vw,2.6rem)]">{x.k}</h3>
                  <p className="mt-2 max-w-[40ch] text-[15px] text-ink/70">{x.v}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
