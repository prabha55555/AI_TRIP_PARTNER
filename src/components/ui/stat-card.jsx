import { cn } from "@/lib/utils";

/** Label + value tile. Used for dashboard totals and trip summaries. */
export function StatCard({ icon: Icon, label, value, className }) {
    return (
        <div className={cn("flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-soft", className)}>
            {Icon && (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
            )}
            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="display-md truncate">{value}</p>
            </div>
        </div>
    );
}
