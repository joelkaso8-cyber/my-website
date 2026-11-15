"use client";
import { useRef } from "react";
import MaskedTitle from "@/components/ui/MaskedTitle";
import { MANIFESTO } from "@/content/site";
import { useGSAP } from "@/lib/gsap";
import { revealIn } from "@/lib/reveal";

// Manifesto on an asymmetric 12-column grid: label in the margin, headline offset right,
// two columns of copy that don't line up on purpose, then principles as a ruled index.
export default function EditorialShowcase() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => revealIn(root.current!), { scope: root });

  return (
    <section ref={root} id="manifesto" aria-labelledby="manifesto-title" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-5 md:px-10">
        <div data-rule className="col-span-12 h-px bg-white/10" />
        <p data-rise className="micro col-span-12 text-bone/60 md:col-span-3">{MANIFESTO.label}</p>
        <MaskedTitle
          id="manifesto-title"
          lines={MANIFESTO.title}
          italicLast
          className="col-span-12 text-[clamp(2.6rem,6.6vw,6.5rem)] md:col-span-9"
        />

        <p data-rise="1" className="col-span-12 max-w-[62ch] text-[17px] text-bone/75 md:col-span-4 md:col-start-4 md:mt-8">
          {MANIFESTO.paragraphs[0]}
        </p>
        <p data-rise="2" className="col-span-12 max-w-[62ch] text-[17px] text-bone/75 md:col-span-4 md:col-start-9 md:mt-28">
          {MANIFESTO.paragraphs[1]}
        </p>

        <ol className="col-span-12 mt-8 md:col-span-9 md:col-start-4 md:mt-16">
          {MANIFESTO.principles.map((p, i) => (
            <li key={p.k} className="group relative">
              <div data-rule className="h-px bg-white/10" />
              <div data-rise={i} className="grid grid-cols-12 items-baseline gap-x-6 py-7 md:py-9">
                <span className="micro col-span-2 text-bone/50">0{i + 1}</span>
                <h3 className="display col-span-10 text-[clamp(2rem,3.6vw,3.25rem)] transition-colors duration-300 ease-out group-hover:text-copper-2 md:col-span-4">
                  {p.k}
                </h3>
                <p className="col-span-10 col-start-3 mt-2 max-w-[44ch] text-[15px] text-bone/70 md:col-span-6 md:mt-0">{p.v}</p>
              </div>
            </li>
          ))}
          <li aria-hidden="true"><div data-rule className="h-px bg-white/10" /></li>
        </ol>
      </div>
    </section>
  );
}
