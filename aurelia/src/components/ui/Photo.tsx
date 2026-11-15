"use client";
import { useEffect, useRef } from "react";
import { unsplash, unsplashSet } from "@/content/site";

type Props = {
  id: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  widths?: number[];
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

// An Unsplash photo that fades in once decoded. If it never loads, the warm stone tone behind it stays,
// so there is never a broken-image icon.
export default function Photo({ id, alt, width, height, sizes, widths = [640, 1080, 1600], className = "", imgClassName = "", priority }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    const done = () => { img.dataset.loaded = "true"; };
    const fail = () => { img.style.visibility = "hidden"; };
    if (img.complete) { if (img.naturalWidth) done(); else fail(); return; }
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", fail, { once: true });
    return () => { img.removeEventListener("load", done); img.removeEventListener("error", fail); };
  }, []);

  return (
    <div className={`photo relative overflow-hidden ${className}`}>
      <img
        ref={ref}
        src={unsplash(id, widths[1] ?? widths[0])}
        srcSet={unsplashSet(id, widths)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
