import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-60",
    {
        variants: {
            variant: {
                primary: "bg-brand-600 text-white hover:bg-brand-700",
                outline: "border border-border-strong bg-card text-foreground hover:border-foreground hover:bg-muted",
                ghost: "text-foreground hover:bg-muted",
                danger: "bg-danger text-white hover:bg-red-800",
                light: "bg-white text-foreground hover:bg-brand-50",
            },
            size: {
                sm: "h-10 px-4 text-sm",
                md: "h-11 px-6 text-sm",
                lg: "h-12 px-7 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: { variant: "primary", size: "md" },
    }
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
