import type { ElementType } from "react";

// A display headline split into masked lines; revealIn() slides each line up on scroll.
export default function MaskedTitle({ lines, as: Tag = "h2", id, className = "", italicLast = false }: {
  lines: string[]; as?: ElementType; id?: string; className?: string; italicLast?: boolean;
}) {
  return (
    <Tag id={id} data-reveal className={`display ${className}`}>
      {lines.map((l, i) => (
        <span key={l} className="mask">
          <span className={italicLast && i === lines.length - 1 ? "italic text-bone/55" : undefined}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
