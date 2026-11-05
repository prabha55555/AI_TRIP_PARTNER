import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { CalendarDays, Luggage, MapPin, Plane, Plus, SearchX, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { db } from "@/AI/firebase";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput, Select } from "@/components/ui/form-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/lib/auth";
import { filterAndSortTrips, firstName, SORT_OPTIONS, tripLabel, tripStats } from "@/lib/trips";
import UserTripCardItem from "./UserTripCardItem";

function TripSkeletons() {
    return (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading your trips">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-[4/3] rounded-2xl" />
                    <Skeleton className="mt-3 h-5 w-2/3" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
}

function MyTrips() {
    const { user } = useAuth();
    const [trips, setTrips] = useState(null); // null = loading
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const email = user?.email;

    useEffect(() => {
        if (!email) return;
        let cancelled = false;
        (async () => {
            try {
                const snap = await getDocs(query(collection(db, "AI-Trips"), where("userEmail", "==", email)));
                if (cancelled) return;
                setTrips(snap.docs.map((d) => d.data()));
                setError(false);
            } catch (err) {
                console.error("Failed to load trips", err);
                if (!cancelled) setError(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [email, reloadKey]);

    const stats = useMemo(() => tripStats(trips ?? []), [trips]);
    const visible = useMemo(() => filterAndSortTrips(trips ?? [], search, sort), [trips, search, sort]);

    const retry = () => {
        setError(false);
        setTrips(null);
        setReloadKey((k) => k + 1);
    };

    // Optimistic delete: remove from the list immediately, restore it if Firestore rejects.
    const confirmDelete = async () => {
        const target = pendingDelete;
        if (!target) return;
        const snapshot = trips;
        setDeleting(true);
        setTrips((list) => list.filter((t) => t.id !== target.id));
        setPendingDelete(null);
        try {
            await deleteDoc(doc(db, "AI-Trips", target.id));
            toast.success(`Deleted your trip to ${tripLabel(target).split(",")[0] || "this destination"}.`);
        } catch (err) {
            console.error("Failed to delete trip", err);
            setTrips(snapshot);
            toast.error("Couldn't delete that trip. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    if (!user) return <Navigate to="/" replace />;

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="display-xl">Welcome back, {firstName(user)}</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Your saved itineraries, all in one place.</p>
                </div>
                <Button asChild>
                    <Link to="/create"><Plus className="h-4 w-4" /> New trip</Link>
                </Button>
            </div>

            {error ? (
                <EmptyState
                    tone="danger"
                    icon={TriangleAlert}
                    title="We couldn't load your trips"
                    description="Please check your connection and try again."
                >
                    <Button onClick={retry}>Try again</Button>
                </EmptyState>
            ) : trips === null ? (
                <div className="mt-8">
                    <TripSkeletons />
                </div>
            ) : trips.length === 0 ? (
                <EmptyState
                    icon={Luggage}
                    title="No trips yet"
                    description="Plan your first adventure. It takes about a minute and is saved here automatically."
                >
                    <Button asChild size="lg">
                        <Link to="/create"><Plane className="h-5 w-5" /> Plan a trip</Link>
                    </Button>
                </EmptyState>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3" role="group" aria-label="Trip summary">
                        <StatCard icon={Luggage} label="Total trips" value={stats.totalTrips} />
                        <StatCard icon={CalendarDays} label="Days planned" value={stats.totalDays} />
                        <StatCard icon={MapPin} label="Destinations" value={stats.destinations} />
                    </div>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <SearchInput
                            className="sm:max-w-sm sm:flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by destination"
                            aria-label="Search trips by destination"
                        />
                        <Select className="sm:w-48" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort trips">
                            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Select>
                        <p className="text-sm text-muted-foreground sm:ml-auto" role="status" aria-live="polite">
                            {visible.length} {visible.length === 1 ? "trip" : "trips"}
                            {search.trim() && ` matching “${search.trim()}”`}
                        </p>
                    </div>

                    {visible.length === 0 ? (
                        <EmptyState icon={SearchX} title="No matching trips" description={`Nothing matches “${search.trim()}”. Try a different destination.`}>
                            <Button variant="outline" onClick={() => setSearch("")}>Clear search</Button>
                        </EmptyState>
                    ) : (
                        <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {visible.map((trip) => (
                                <UserTripCardItem key={trip.id} trip={trip} onDelete={setPendingDelete} />
                            ))}
                        </div>
                    )}
                </>
            )}

            <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent className="max-w-md rounded-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Delete this trip?</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Your trip to {tripLabel(pendingDelete ?? {}) || "this destination"} will be permanently removed. This can&apos;t be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete} disabled={deleting}>Delete trip</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default MyTrips;
