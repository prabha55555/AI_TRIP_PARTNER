import { cn } from "@/lib/utils";

/** Neutral loading placeholder. Pass size/radius via className. */
export function Skeleton({ className, ...props }) {
    return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-muted", className)} {...props} />;
}
