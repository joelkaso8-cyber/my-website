"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, BedDouble, Check, UtensilsCrossed, X } from "lucide-react";
import GoldWordmark from "@/components/ui/GoldWordmark";
import MaskedTitle from "@/components/ui/MaskedTitle";
import Photo from "@/components/ui/Photo";
import { BOOKING, BRAND, DEMO_NOTE, FOOTER } from "@/content/site";
import { useGSAP } from "@/lib/gsap";
import { revealIn } from "@/lib/reveal";

type Mode = (typeof BOOKING.modes)[number]["id"];
const TIMES = ["19:00", "19:30", "20:00", "20:30", "21:00"];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const nice = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// Direct inquiry bar (suite or table) above the architectural footer. Submitting opens a confirmation
// dialog that says plainly that this is a prototype and nothing was sent.
export default function BookingFooter() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<Mode>("suite");
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [suite, setSuite] = useState(BOOKING.suites[0]);
  const [time, setTime] = useState(TIMES[2]);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string[]>([]);

  useGSAP(() => revealIn(root.current!), { scope: root });

  // Dates are set in the browser so the static HTML never disagrees with the visitor's clock.
  useEffect(() => {
    const t = new Date();
    const a = new Date(t); a.setDate(t.getDate() + 14);
    const b = new Date(t); b.setDate(t.getDate() + 17);
    setToday(iso(t)); setCheckIn(iso(a)); setCheckOut(iso(b));
  }, []);

  const nights = checkIn && checkOut ? Math.round((+new Date(checkOut) - +new Date(checkIn)) / 864e5) : 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!checkIn) return setError("Choose a date.");
    if (mode === "suite" && nights < 1) return setError("Check-out must be after check-in.");
    setError("");
    setSummary(mode === "suite"
      ? [suite, `${nice(checkIn)} → ${nice(checkOut)}`, `${nights} night${nights > 1 ? "s" : ""} · ${guests} guest${guests === "1" ? "" : "s"}`]
      : ["Hearth tasting menu", `${nice(checkIn)} at ${time}`, `Table for ${guests}`]);
    dialog.current?.showModal();
  };

  const field = "peer w-full min-h-12 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 pt-5 pb-1.5 text-[15px] text-alabaster outline-none transition-colors duration-300 ease-out hover:border-white/25 focus:border-gold/70 [color-scheme:dark]";
  const label = "micro pointer-events-none absolute left-4 top-2 text-[10px] text-alabaster/50";

  return (
    <div ref={root} className="relative z-10 overflow-hidden">
      <section id="reserve" aria-labelledby="reserve-title" className="relative py-24 md:py-36">
        {/* Candlelit room behind, heavily shaded */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Photo id={BOOKING.photo} alt="" width={1600} height={1000} sizes="100vw" widths={[960, 1600]} className="h-full w-full opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink)_0%,rgb(10_10_9/0.7)_40%,var(--color-ink)_100%)]" />
        </div>

        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-5 md:px-10">
          <div data-rule className="col-span-12 h-px bg-white/10" />
          <p data-rise className="micro col-span-12 text-alabaster/55 md:col-span-3">{BOOKING.label}</p>
          <div className="col-span-12 md:col-span-9">
            <MaskedTitle id="reserve-title" lines={BOOKING.title} italicLast className="text-[clamp(3rem,8vw,7.5rem)] font-light" />
            <p data-rise className="mt-6 max-w-[48ch] text-[17px] text-alabaster/75">{BOOKING.lead}</p>
          </div>

          <form
            data-rise
            onSubmit={submit}
            noValidate
            aria-describedby={error ? "booking-error" : undefined}
            className="col-span-12 rounded-[24px] border border-white/10 bg-ink/60 p-3 backdrop-blur-xl md:p-4"
          >
            <div className="grid gap-3 md:grid-cols-12 md:items-stretch">
              {/* Suite / Table toggle */}
              <fieldset className="md:col-span-2">
                <legend className="sr-only">Book a suite or a table</legend>
                <div className="grid h-full grid-cols-2 gap-1 rounded-[14px] border border-white/10 bg-white/[0.03] p-1">
                  {BOOKING.modes.map((m) => (
                    <label key={m.id} className={`relative flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] text-[14px] transition-colors duration-300 ease-out has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-2 ${mode === m.id ? "bg-gold text-ink" : "text-alabaster/70 hover:text-alabaster"}`}>
                      <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="sr-only" />
                      {m.id === "suite" ? <BedDouble size={15} aria-hidden="true" /> : <UtensilsCrossed size={15} aria-hidden="true" />}
                      {m.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="relative md:col-span-2">
                <input id="checkin" type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={field} required />
                <label htmlFor="checkin" className={label}>{mode === "suite" ? "Check-in" : "Date"}</label>
              </div>
              {mode === "suite" ? (
                <div className="relative md:col-span-2">
                  <input id="checkout" type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={field} required />
                  <label htmlFor="checkout" className={label}>Check-out</label>
                </div>
              ) : (
                <div className="relative md:col-span-2">
                  <select id="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${field} appearance-none`}>
                    {TIMES.map((t) => <option key={t} className="bg-ink">{t}</option>)}
                  </select>
                  <label htmlFor="time" className={label}>Seating</label>
                </div>
              )}
              <div className="relative md:col-span-2">
                <select id="guests" value={guests} onChange={(e) => setGuests(e.target.value)} className={`${field} appearance-none`}>
                  {["1", "2", "3", "4", "5", "6"].map((g) => <option key={g} value={g} className="bg-ink">{g} guest{g === "1" ? "" : "s"}</option>)}
                </select>
                <label htmlFor="guests" className={label}>Guests</label>
              </div>
              <div className="relative md:col-span-2">
                {mode === "suite" ? (
                  <>
                    <select id="suite" value={suite} onChange={(e) => setSuite(e.target.value)} className={`${field} appearance-none`}>
                      {BOOKING.suites.map((s) => <option key={s} className="bg-ink">{s}</option>)}
                    </select>
                    <label htmlFor="suite" className={label}>Suite</label>
                  </>
                ) : (
                  <p className="flex h-full min-h-12 flex-col justify-center rounded-[14px] border border-white/10 bg-white/[0.02] px-4 text-[14px] text-alabaster/70">
                    <span className="micro text-[10px] text-alabaster/50">Menu</span>9 courses · 165€
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-[15px] font-medium text-ink transition-colors duration-300 ease-out hover:bg-gold-2 md:col-span-2"
              >
                Check availability
                <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
            <p id="booking-error" role="alert" className="min-h-6 px-2 pt-2 text-[13px] text-gold-2">{error}</p>
          </form>
        </div>
      </section>

      <dialog
        ref={dialog}
        aria-labelledby="dialog-title"
        className="m-auto w-[min(92vw,480px)] rounded-[24px] border border-white/10 bg-stone p-0 text-alabaster backdrop:bg-transparent"
      >
        <div className="p-7 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-full border border-gold/50 text-gold-2"><Check size={18} aria-hidden="true" /></span>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="grid size-11 place-items-center rounded-full border border-white/10 transition-colors duration-300 ease-out hover:border-white/30">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <h2 id="dialog-title" className="display mt-6 text-[2.6rem] font-light">Your dates are noted.</h2>
          <ul className="mt-5 space-y-2 border-y border-white/10 py-5">
            {summary.map((s) => <li key={s} className="text-[15px] text-alabaster/85">{s}</li>)}
          </ul>
          <p className="micro mt-5 leading-[1.7] text-gold-2">Demo prototype · no request was sent</p>
          <p className="mt-2 text-[14px] text-alabaster/65">{DEMO_NOTE}</p>
        </div>
      </dialog>

      {/* Architectural footer */}
      <footer>
      <div className="mx-auto max-w-[1440px] px-5 pb-12 md:px-10 md:pb-10">
        <div data-rule className="h-px bg-white/10" />
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 pt-10">
          <p className="display col-span-12 text-[2rem] font-light md:col-span-4">{BRAND.full}</p>
          {FOOTER.columns.map((c) => (
            <div key={c.h} className="col-span-6 md:col-span-2">
              <p className="micro text-alabaster/45">{c.h}</p>
              <ul className="mt-3 space-y-1.5 text-[14px] text-alabaster/75">{c.lines.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
          ))}
          <div className="col-span-12 md:col-span-4">
            <p className="micro text-alabaster/45">About this site</p>
            <p className="mt-3 max-w-[44ch] text-[14px] text-alabaster/75">{DEMO_NOTE}</p>
            <a href={BRAND.studioUrl} target="_blank" rel="noopener noreferrer" className="micro mt-4 inline-flex min-h-11 items-center gap-1.5 text-gold-2 transition-colors duration-300 ease-out hover:text-alabaster">
              Designed by {BRAND.studio}<ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <GoldWordmark text={BRAND.name} />
      <div className="micro mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 px-5 pb-28 pt-6 text-alabaster/45 md:px-10 md:pb-8">
        <span>© 2026 {BRAND.studio} · Prototype</span>
        <span>{BRAND.coords}</span>
        <a href="#top" className="transition-colors duration-300 ease-out hover:text-alabaster">Back to top</a>
      </div>
      </footer>
    </div>
  );
}
