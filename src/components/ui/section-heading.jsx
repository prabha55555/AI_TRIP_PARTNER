import { cn } from "@/lib/utils";

/** Eyebrow + serif title (+ optional description). `as` sets the heading level. */
export function SectionHeading({ eyebrow, title, description, as: Tag = "h2", className }) {
    return (
        <div className={cn("max-w-2xl", className)}>
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{eyebrow}</p>}
            <Tag className="display-lg mt-2">{title}</Tag>
            {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
        </div>
    );
}
