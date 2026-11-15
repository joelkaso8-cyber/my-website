import type { ElementType } from "react";

// A display headline split into masked lines; revealIn() slides each line up on scroll.
export default function MaskedTitle({ lines, as: Tag = "h2", id, className = "", italicLast = false, italicClass = "italic text-gold-2" }: {
  lines: string[]; as?: ElementType; id?: string; className?: string; italicLast?: boolean; italicClass?: string;
}) {
  return (
    <Tag id={id} data-reveal className={`display ${className}`}>
      {lines.map((l, i) => (
        <span key={l} className="mask">
          <span className={italicLast && i === lines.length - 1 ? italicClass : undefined}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
