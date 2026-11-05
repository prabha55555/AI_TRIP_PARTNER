import { CalendarDays, Hotel, MapPin, Users, Wallet } from "lucide-react";
import PlacePhoto from "@/components/custom/PlacePhoto";
import ShareButton from "@/components/custom/ShareButton";
import { Badge } from "@/components/ui/badge";
import { galleryQueries } from "@/lib/trips";

/** Title, meta row and a photo gallery built only from real Places photos (placeholders when missing). */
function InfoSection({ trip }) {
    const label = trip?.userLocation?.destination?.label;
    const small = galleryQueries(trip, 4);
    const slots = Array.from({ length: 4 }, (_, i) => small[i]);

    return (
        <section>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="display-xl">{label}</h1>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{trip.userLocation?.DaysCount} days</Badge>
                        <Badge><Wallet className="h-3.5 w-3.5" aria-hidden="true" />{trip.userLocation?.Budget}</Badge>
                        <Badge><Users className="h-3.5 w-3.5" aria-hidden="true" />{trip.userLocation?.PeopleCount}</Badge>
                    </div>
                </div>
                <ShareButton title={`Trip to ${label}`} />
            </div>

            <div className="mt-6 grid gap-2 overflow-hidden rounded-2xl sm:h-[26rem] sm:grid-cols-4 sm:grid-rows-2">
                <PlacePhoto
                    query={label}
                    large
                    alt={label ?? ""}
                    icon={MapPin}
                    className="aspect-[3/2] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
                />
                {slots.map((q, i) => (
                    <PlacePhoto
                        key={i}
                        query={q}
                        alt={q ?? ""}
                        icon={i === 0 ? Hotel : MapPin}
                        className="hidden sm:block"
                    />
                ))}
            </div>
        </section>
    );
}

export default InfoSection;
