"use client";
import { useRef } from "react";
import { Check, MessageCircle } from "lucide-react";
import MaskedTitle from "@/components/ui/MaskedTitle";
import { PRICING, waLink } from "@/content/site";
import { useGSAP } from "@/lib/gsap";
import { revealIn } from "@/lib/reveal";

// Three tiers as ruled columns, not boxes. The middle one is the only place copper fills a surface.
export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => revealIn(root.current!), { scope: root });

  return (
    <section ref={root} id="pricing" aria-labelledby="pricing-title" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-8 px-5 md:px-10">
        <div data-rule className="col-span-12 h-px bg-white/10" />
        <p data-rise className="micro col-span-12 text-bone/60 md:col-span-3">{PRICING.label}</p>
        <MaskedTitle id="pricing-title" lines={PRICING.title} italicLast className="col-span-12 text-[clamp(2.6rem,6.6vw,6.5rem)] md:col-span-9" />
        <p data-rise="1" className="col-span-12 max-w-[60ch] text-[15px] text-bone/70 md:col-span-5 md:col-start-4">{PRICING.note}</p>

        <div className="col-span-12 mt-8 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-0">
          {PRICING.plans.map((p, i) => (
            <article
              key={p.name}
              data-rise={i}
              aria-labelledby={`plan-${i}`}
              className={`relative flex flex-col rounded-[22px] border p-6 transition-[border-color,background-color] duration-300 ease-out md:rounded-none md:border-y-0 md:border-r-0 md:p-9 ${
                p.featured
                  ? "border-copper/40 bg-copper/[0.07] md:rounded-[22px] md:border md:border-copper/40"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] md:bg-transparent md:first:border-l-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 id={`plan-${i}`} className="micro text-bone">{p.name}</h3>
                {p.featured && <span className="micro rounded-full bg-copper px-2.5 py-1 text-ink">Most chosen</span>}
              </div>
              <p className="mt-8 flex items-baseline gap-3">
                <span className="display text-[clamp(3.4rem,6vw,5.2rem)] tracking-[-0.05em]">{p.price}</span>
                {p.was && <s className="micro text-bone/50"><span className="sr-only">Usual price </span>{p.was}</s>}
              </p>
              <p className="mt-3 max-w-[34ch] text-[15px] text-bone/70">{p.for}</p>
              <div className="my-7 h-px bg-white/10" />
              <ul className="space-y-3">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[15px] text-bone/85">
                    <Check size={16} aria-hidden="true" className={`mt-1 shrink-0 ${p.featured ? "text-copper-2" : "text-bone/45"}`} />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="flex-1" />
              <a
                href={waLink(p.wa)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium transition-all duration-300 ease-out ${
                  p.featured
                    ? "bg-copper text-ink hover:bg-copper-2"
                    : "border border-white/15 text-bone hover:border-white/35 hover:bg-white/[0.06]"
                }`}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Start with {p.name}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
