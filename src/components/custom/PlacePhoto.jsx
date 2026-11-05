import { ImageOff } from "lucide-react";
import { useState } from "react";
import { usePlacePhoto } from "@/AI/GlobalApi";
import { cn } from "@/lib/utils";

/**
 * A place photo with three explicit states: loading skeleton, image, and a neutral
 * placeholder (icon on muted background) when there is no photo or it fails to load.
 * The parent controls size/shape through `className`.
 */
function PlacePhoto({ query, alt = "", large = false, icon: Icon = ImageOff, className, imgClassName }) {
    const { url, loading } = usePlacePhoto(query, { large });
    const [failedUrl, setFailedUrl] = useState(null);
    const showImage = url && failedUrl !== url;

    return (
        <div className={cn("relative overflow-hidden bg-muted", className)}>
            {loading ? (
                <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
            ) : showImage ? (
                <img
                    src={url}
                    alt={alt}
                    loading={large ? "eager" : "lazy"}
                    referrerPolicy="no-referrer"
                    onError={() => setFailedUrl(url)}
                    className={cn("h-full w-full object-cover", imgClassName)}
                />
            ) : (
                <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground" role="img" aria-label={alt ? `${alt} (no photo available)` : "No photo available"}>
                    <Icon className="h-8 w-8" aria-hidden="true" />
                </div>
            )}
        </div>
    );
}

export default PlacePhoto;
