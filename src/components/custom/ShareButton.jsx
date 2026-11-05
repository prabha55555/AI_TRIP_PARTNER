import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Uses the native share sheet where available, otherwise copies the page link. */
function ShareButton({ title, variant = "outline", size = "sm", className }) {
    const [copied, setCopied] = useState(false);

    const share = async () => {
        const link = window.location.href;
        try {
            if (navigator.share) await navigator.share({ title, url: link });
            else {
                await navigator.clipboard.writeText(link);
                setCopied(true);
                toast.success("Link copied to clipboard");
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            if (err?.name !== "AbortError") toast.error("Couldn't share this trip.");
        }
    };

    return (
        <Button variant={variant} size={size} className={className} onClick={share}>
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} Share
        </Button>
    );
}

export default ShareButton;
