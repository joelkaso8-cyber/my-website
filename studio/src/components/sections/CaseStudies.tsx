"use client";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import MaskedTitle from "@/components/ui/MaskedTitle";
import { CASES, workUrl, type Case } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { revealIn } from "@/lib/reveal";

// Light that follows the cursor across a card's hairline surface.
const spot = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function CaseCard({ c, big, i }: { c: Case; big?: boolean; i: number }) {
  return (
    <article
      data-rise={i}
      onPointerMove={spot}
      className={`case group relative flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] backdrop-blur-md transition-[border-color] duration-300 ease-out hover:border-white/20 ${big ? "md:row-span-2" : ""}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(207_138_92/0.10),transparent_65%)]" />
      <div className={`relative overflow-hidden ${big ? "p-3 md:p-4" : "p-3"}`}>
        <div className="case-media relative overflow-hidden rounded-[14px]">
          <img
            src={`/work/${c.id}-desk${big ? "" : "-600"}.webp`}
            alt={`${c.name} homepage on a desktop screen`}
            width={big ? 1200 : 600}
            height={big ? 750 : 375}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
          />
          {big && (
            <img
              src={`/work/${c.id}-phone.webp`}
              alt={`${c.name} on a phone`}
              width={390}
              height={844}
              loading="lazy"
              decoding="async"
              className="case-phone absolute bottom-[6%] right-[5%] w-[19%] rounded-[12px] border border-white/20"
            />
          )}
        </div>
      </div>
      <div className={`relative flex flex-1 flex-col ${big ? "px-5 pb-6 pt-3 md:px-8 md:pb-8" : "px-5 pb-5 pt-2"}`}>
        <div className="micro flex flex-wrap items-center gap-x-3 gap-y-2 text-bone/60">
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-bone">{c.tag}</span>
          <span>{c.tier}</span>
        </div>
        <h3 className={`display mt-4 ${big ? "text-[clamp(2.2rem,4vw,3.6rem)]" : "text-[clamp(1.9rem,2.6vw,2.4rem)]"}`}>{c.name}</h3>
        <p className="micro mt-2 text-bone/60">{c.where}</p>
        <p className={`mt-4 text-[15px] text-bone/75 ${big ? "max-w-[56ch]" : "max-w-[46ch]"}`}>{c.summary}</p>
        {big && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {c.points.map((p) => (
              <li key={p} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] text-bone/80">{p}</li>
            ))}
          </ul>
        )}
        <a
          href={workUrl(c.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-[14px] font-medium text-bone transition-colors duration-300 ease-out hover:text-copper-2"
        >
          Open the {c.tag === "Demo" ? "demo" : "preview"}
          <span className="sr-only">: {c.name} (opens in a new tab)</span>
          <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

export default function CaseStudies() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    revealIn(root.current!);
    if (prefersReducedMotion()) return;
    // The phone rides up a little faster than its screen as the card passes.
    gsap.utils.toArray<HTMLElement>(".case-phone").forEach((ph) => {
      gsap.fromTo(ph, { yPercent: 18 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: ph.closest(".case"), start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, { scope: root });

  return (
    <section ref={root} id="cases" aria-labelledby="cases-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <p data-rise className="micro col-span-12 text-bone/60 md:col-span-3 md:pt-4">(02) Case studies</p>
          <MaskedTitle id="cases-title" lines={["One family hotel,", "two working demos."]} italicLast className="col-span-12 text-[clamp(2.5rem,6vw,5rem)] md:col-span-6" />
          <p data-rise="1" className="col-span-12 max-w-[40ch] self-end text-[15px] text-bone/70 md:col-span-3">
            I&apos;m starting out, so I say plainly which is which: the hotel is my family&apos;s, the rest are demos.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-12 md:grid-rows-2">
          <div className="grid md:col-span-8 md:row-span-2"><CaseCard c={CASES[0]} big i={0} /></div>
          <div className="grid md:col-span-4"><CaseCard c={CASES[1]} i={1} /></div>
          <div className="grid md:col-span-4"><CaseCard c={CASES[2]} i={2} /></div>
        </div>
      </div>
    </section>
  );
}
