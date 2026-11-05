import { Hotel, Star } from "lucide-react";
import PlacePhoto from "@/components/custom/PlacePhoto";
import { Badge } from "@/components/ui/badge";

function HotelCardItem({ hotel }) {
    const mapsUrl =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(`${hotel?.hotelName}, ${hotel?.hotelAddress ?? ""}`);
    const topRated = Number(hotel?.rating) >= 4.5;

    return (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="relative">
                <PlacePhoto
                    query={hotel?.hotelName}
                    alt={hotel?.hotelName ?? ""}
                    icon={Hotel}
                    className="aspect-[4/3] rounded-2xl"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {topRated && <Badge variant="overlay" className="absolute left-3 top-3 font-semibold shadow-sm">Top rated</Badge>}
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
                <h3 className="font-semibold">{hotel?.hotelName}</h3>
                {hotel?.rating != null && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                        <Star className="h-4 w-4 fill-foreground text-foreground" aria-hidden="true" /> {hotel.rating}
                    </span>
                )}
            </div>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{hotel?.hotelAddress}</p>
            {hotel?.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{hotel.description}</p>}
            {hotel?.price && <p className="mt-2 text-sm font-semibold">{hotel.price}</p>}
        </a>
    );
}

export default HotelCardItem;
