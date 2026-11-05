import { ChevronDown, Search } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const controlClass =
    "h-12 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15";

export const Input = forwardRef(({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlClass, className)} {...props} />
));
Input.displayName = "Input";

export const SearchInput = forwardRef(({ className, ...props }, ref) => (
    <div className={cn("relative", className)}>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input ref={ref} type="search" className={cn(controlClass, "pl-11")} {...props} />
    </div>
));
SearchInput.displayName = "SearchInput";

export const Select = forwardRef(({ className, children, ...props }, ref) => (
    <div className={cn("relative", className)}>
        <select ref={ref} className={cn(controlClass, "appearance-none pr-10")} {...props}>
            {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
));
Select.displayName = "Select";
