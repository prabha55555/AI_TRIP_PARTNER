import { Clock, MapPin, Star, Ticket } from "lucide-react";
import PlacePhoto from "@/components/custom/PlacePhoto";

function PlaceCard({ place, destination = "" }) {
    const mapsUrl =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent([place?.placeName, destination].filter(Boolean).join(", "));

    return (
        <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-2xl border border-border p-3 transition-shadow hover:shadow-soft"
        >
            <PlacePhoto
                query={place?.placeName}
                alt={place?.placeName ?? ""}
                icon={MapPin}
                className="aspect-[4/3] w-28 shrink-0 self-start rounded-xl sm:w-40"
                imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="min-w-0 flex-1 py-0.5">
                <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold">{place?.placeName}</h4>
                    {place?.rating != null && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                            <Star className="h-4 w-4 fill-foreground text-foreground" aria-hidden="true" /> {place.rating}
                        </span>
                    )}
                </div>
                {place?.placeDetails && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3">{place.placeDetails}</p>}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {place?.timeTravel && (
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" /> {place.timeTravel}</span>
                    )}
                    {place?.ticketPricing && (
                        <span className="inline-flex items-center gap-1.5"><Ticket className="h-4 w-4" aria-hidden="true" /> {place.ticketPricing}</span>
                    )}
                </div>
            </div>
        </a>
    );
}

export default PlaceCard;
