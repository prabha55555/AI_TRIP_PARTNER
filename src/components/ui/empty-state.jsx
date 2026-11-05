import { cn } from "@/lib/utils";

/** Centered icon + title + description + optional action. For empty, no-results and error states. */
export function EmptyState({ icon: Icon, title, description, children, tone = "default", className }) {
    return (
        <div className={cn("mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center", className)}>
            {Icon && (
                <span
                    className={cn(
                        "grid h-14 w-14 place-items-center rounded-full",
                        tone === "danger" ? "bg-red-50 text-danger" : "bg-brand-50 text-brand-700"
                    )}
                >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
            )}
            <h2 className="display-md mt-5">{title}</h2>
            {description && <p className="mt-2 text-muted-foreground">{description}</p>}
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
}
