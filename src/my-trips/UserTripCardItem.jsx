import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import PlacePhoto from "@/components/custom/PlacePhoto";
import { tripDays, tripLabel, tripTimestamp } from "@/lib/trips";

const dateFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });

function UserTripCardItem({ trip, onDelete }) {
    const label = tripLabel(trip);
    const created = tripTimestamp(trip);
    const days = tripDays(trip);
    const meta = [days ? `${days} ${days === 1 ? "day" : "days"}` : null, trip.userLocation?.Budget, trip.userLocation?.PeopleCount]
        .filter(Boolean)
        .join(" · ");

    return (
        <article className="group relative">
            <Link to={`/view-trip/${trip.id}`} className="block rounded-2xl">
                <PlacePhoto
                    query={label}
                    alt={`Trip to ${label || "destination"}`}
                    className="aspect-[4/3] rounded-2xl"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <h2 className="mt-3 truncate font-semibold">{label || "Untitled trip"}</h2>
                <p className="truncate text-sm text-muted-foreground">{meta || "Trip details unavailable"}</p>
                {created > 0 && <p className="text-sm text-muted-foreground">Created {dateFormat.format(created)}</p>}
            </Link>
            {/* Sibling of the link (not nested) so keyboard and screen-reader users get two distinct controls. */}
            <button
                type="button"
                onClick={() => onDelete(trip)}
                aria-label={`Delete trip to ${label || "destination"}`}
                className="absolute right-3 top-3 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/95 text-foreground opacity-100 shadow-sm transition-colors hover:bg-white hover:text-danger sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
            >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
        </article>
    );
}

export default UserTripCardItem;
