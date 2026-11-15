"use client";
import { useRef } from "react";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import MaskedTitle from "@/components/ui/MaskedTitle";
import { BRAND, FOOTER, waLink } from "@/content/site";
import { useGSAP } from "@/lib/gsap";
import { revealIn } from "@/lib/reveal";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => revealIn(root.current!), { scope: root });
  const year = 2026;

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden pb-32 pt-24 md:pb-12 md:pt-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-5 md:px-10">
        <div data-rule className="col-span-12 h-px bg-white/10" />
        <p data-rise className="micro col-span-12 text-bone/60 md:col-span-3">(04) Contact</p>
        <div className="col-span-12 md:col-span-9">
          <MaskedTitle lines={FOOTER.title} italicLast className="text-[clamp(3rem,9vw,8.5rem)]" />
          <p data-rise="1" className="mt-8 max-w-[46ch] text-[17px] text-bone/75">{FOOTER.lead}</p>
          <div data-rise="2" className="mt-10 flex flex-wrap gap-3">
            <MagneticButton href={waLink(FOOTER.ctaText)} external>
              <MessageCircle size={18} aria-hidden="true" />
              {FOOTER.cta}
            </MagneticButton>
            <MagneticButton href={`mailto:${BRAND.email}`} variant="line">
              <Mail size={16} aria-hidden="true" />
              Email instead
            </MagneticButton>
          </div>
        </div>

        <div data-rule className="col-span-12 mt-10 h-px bg-white/10 md:mt-24" />
        <div className="micro col-span-12 flex flex-col gap-4 text-bone/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} {BRAND.name} · {BRAND.founder} · Albania</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            <li><a href={`tel:+${BRAND.whatsapp}`} className="inline-flex items-center gap-1.5 transition-colors duration-300 ease-out hover:text-bone"><Phone size={12} aria-hidden="true" />{BRAND.phoneDisplay}</a></li>
            <li><a href={BRAND.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors duration-300 ease-out hover:text-bone">All demos<ArrowUpRight size={12} aria-hidden="true" /></a></li>
            <li><a href="#top" className="transition-colors duration-300 ease-out hover:text-bone">Back to top</a></li>
          </ul>
        </div>
      </div>
      {/* Oversized wordmark, cropped by the page edge */}
      <p aria-hidden="true" className="display pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[22vw] leading-[0.8] text-white/[0.04] md:mt-10">
        {BRAND.name}
      </p>
    </footer>
  );
}
