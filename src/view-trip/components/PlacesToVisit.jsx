import { ChevronDown, Route, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { dayNumber, dayRouteUrl, itineraryDays } from "@/lib/trips";
import { cn } from "@/lib/utils";
import PlaceCard from "./PlaceCard";

function PlacesToVisit({ trip }) {
    const itinerary = trip?.tripData?.itinerary ?? {};
    const dayKeys = itineraryDays(trip);
    const destination = trip?.userLocation?.destination?.label ?? "";

    if (dayKeys.length === 0) {
        return <p className="text-muted-foreground">No itinerary available.</p>;
    }

    return (
        <section id="itinerary" className="scroll-mt-24">
            <SectionHeading title="Day-by-day itinerary" description="Open or collapse any day. Times and prices are AI estimates." />

            {/* Mobile/tablet: the desktop summary card is hidden, so jump links live here. */}
            <nav aria-label="Jump to day" className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
                {dayKeys.map((key) => (
                    <a
                        key={key}
                        href={`#day-${dayNumber(key)}`}
                        className="inline-flex h-10 shrink-0 items-center rounded-full border border-border-strong px-4 text-sm font-semibold hover:bg-muted"
                    >
                        Day {dayNumber(key)}
                    </a>
                ))}
            </nav>

            <div className="mt-6 divide-y divide-border border-y border-border">
                {dayKeys.map((key) => {
                    const day = itinerary[key];
                    const plan = Array.isArray(day?.plan) ? day.plan : [];
                    const routeUrl = dayRouteUrl(plan, destination);
                    return (
                        <details key={key} id={`day-${dayNumber(key)}`} open className="group scroll-mt-24 py-5">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg [&::-webkit-details-marker]:hidden">
                                <div className="min-w-0">
                                    <h3 className="display-lg">Day {dayNumber(key)}</h3>
                                    {day?.theme && <p className="mt-0.5 text-muted-foreground">{day.theme}</p>}
                                </div>
                                <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                            </summary>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {day?.bestTimeToVisit && (
                                    <Badge><Sun className="h-3.5 w-3.5" aria-hidden="true" /> Best time: {day.bestTimeToVisit}</Badge>
                                )}
                                {routeUrl && (
                                    <a
                                        href={routeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                                    >
                                        <Route className="h-4 w-4" aria-hidden="true" /> Open day route in Google Maps
                                    </a>
                                )}
                            </div>

                            <ol className="relative mt-6 space-y-5 before:absolute before:bottom-4 before:left-[0.9rem] before:top-4 before:w-px before:bg-border-strong">
                                {plan.map((place, i) => (
                                    <li key={`${place.placeName}-${i}`} className="relative pl-12">
                                        <span className="absolute left-0 top-3 grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-bold text-white ring-4 ring-white">
                                            {i + 1}
                                        </span>
                                        <PlaceCard place={place} destination={destination} />
                                    </li>
                                ))}
                            </ol>
                        </details>
                    );
                })}
            </div>
        </section>
    );
}

export default PlacesToVisit;
