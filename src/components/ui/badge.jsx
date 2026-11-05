import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", {
    variants: {
        variant: {
            neutral: "bg-muted text-foreground",
            brand: "bg-brand-50 text-brand-800",
            sky: "bg-muted text-foreground",
            overlay: "bg-white/90 text-foreground backdrop-blur",
        },
    },
    defaultVariants: { variant: "neutral" },
});

export function Badge({ className, variant, ...props }) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
