import { DEMO_NOTE } from "@/content/site";

// Always-visible label: this is a design prototype for a fictional hotel, not a real business.
export default function DemoBadge() {
  return (
    <p
      title={DEMO_NOTE}
      className="micro pointer-events-none fixed left-4 top-4 z-50 rounded-full border border-gold/40 bg-ink/70 px-3 py-1.5 text-[10px] text-gold-2 backdrop-blur-md md:bottom-5 md:left-5 md:top-auto"
    >
      Demo · fictional hotel
    </p>
  );
}
