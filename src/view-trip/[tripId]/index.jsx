import { doc, getDoc } from "firebase/firestore";
import { SearchX, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../AI/firebase";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { tripOverview } from "@/lib/trips";
import Hotels from "../components/Hotels";
import InfoSection from "../components/InfoSection";
import PlacesToVisit from "../components/PlacesToVisit";
import TripSummary from "../components/TripSummary";

function TripSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading trip">
            <Skeleton className="h-10 w-2/3 max-w-md" />
            <Skeleton className="mt-4 h-8 w-1/2 max-w-sm" />
            <Skeleton className="mt-6 h-72 rounded-2xl sm:h-[26rem]" />
            <div className="mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i}>
                        <Skeleton className="aspect-[4/3] rounded-2xl" />
                        <Skeleton className="mt-3 h-5 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Viewtrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [status, setStatus] = useState("loading"); // loading | ready | missing | error

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        (async () => {
            try {
                const snap = await getDoc(doc(db, "AI-Trips", tripId));
                if (cancelled) return;
                if (snap.exists()) {
                    setTrip(snap.data());
                    setStatus("ready");
                } else {
                    setStatus("missing");
                }
            } catch (err) {
                console.error("Failed to load trip", err);
                if (!cancelled) setStatus("error");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [tripId]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            {status === "loading" && <TripSkeleton />}

            {status === "missing" && (
                <EmptyState
                    icon={SearchX}
                    title="Trip not found"
                    description="This link may be wrong or the trip may have been removed."
                >
                    <Button asChild><Link to="/create">Plan a new trip</Link></Button>
                </EmptyState>
            )}

            {status === "error" && (
                <EmptyState
                    tone="danger"
                    icon={TriangleAlert}
                    title="Couldn't load this trip"
                    description="Please check your connection and try again."
                >
                    <Button onClick={() => window.location.reload()}>Reload</Button>
                </EmptyState>
            )}

            {status === "ready" && (
                <>
                    <InfoSection trip={trip} />
                    <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
                        <div className="space-y-14">
                            <p className="text-lg leading-relaxed">{tripOverview(trip)}</p>
                            <Hotels trip={trip} />
                            <PlacesToVisit trip={trip} />
                        </div>
                        <TripSummary trip={trip} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Viewtrip;
