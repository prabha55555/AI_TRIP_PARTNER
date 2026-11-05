import { CalendarDays, Hotel, MapPin, Ticket, Users, Wallet } from "lucide-react";
import ShareButton from "@/components/custom/ShareButton";
import { dayNumber, itineraryDays, tripCounts, tripOverview } from "@/lib/trips";

function Row({ icon: Icon, label, value }) {
    return (
        <li className="flex items-center gap-3 py-3">
            <Icon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">{label}</span>
            <span className="ml-auto text-right font-semibold">{value}</span>
        </li>
    );
}

/** Sticky right-hand card on desktop. Everything shown comes from the saved trip. */
function TripSummary({ trip }) {
    const loc = trip?.userLocation ?? {};
    const counts = tripCounts(trip);
    const days = itineraryDays(trip);

    return (
        <aside aria-label="Trip summary" className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border-strong bg-card p-6 shadow-lift">
                <h2 className="display-md">Trip summary</h2>
                <ul className="mt-2 divide-y divide-border">
                    <Row icon={MapPin} label="Destination" value={loc.destination?.label} />
                    <Row icon={CalendarDays} label="Duration" value={`${loc.DaysCount} days`} />
                    <Row icon={Wallet} label="Budget" value={loc.Budget} />
                    <Row icon={Users} label="Travellers" value={loc.PeopleCount} />
                    <Row icon={Hotel} label="Hotels" value={counts.hotels} />
                    <Row icon={Ticket} label="Places" value={counts.places} />
                </ul>
                {days.length > 0 && (
                    <nav aria-label="Jump to day" className="mt-4 border-t border-border pt-4">
                        <p className="text-sm font-semibold">Jump to day</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {days.map((k) => (
                                <a
                                    key={k}
                                    href={`#day-${dayNumber(k)}`}
                                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-border-strong px-3 text-sm font-semibold transition-colors hover:border-foreground hover:bg-muted"
                                >
                                    {dayNumber(k)}
                                </a>
                            ))}
                        </div>
                    </nav>
                )}
                <ShareButton title={`Trip to ${loc.destination?.label}`} size="lg" className="mt-5 w-full" />
                <p className="mt-4 text-sm text-muted-foreground">{tripOverview(trip)}</p>
            </div>
        </aside>
    );
}

export default TripSummary;
