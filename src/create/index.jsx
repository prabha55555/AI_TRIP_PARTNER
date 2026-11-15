import { doc, setDoc } from "firebase/firestore";
import { CalendarDays, Check, Loader2, MapPin, Sparkles, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateTripPlan } from "@/AI/AIModel.jsx";
import { db } from "@/AI/firebase.jsx";
import DestinationSearch from "@/components/custom/DestinationSearch";
import PlacePhoto from "@/components/custom/PlacePhoto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { BudgetCategories, MAX_DAYS, MIN_DAYS, SelectTravelList } from "./option.jsx";

const LOADING_MESSAGES = [
    "Finding the best spots…",
    "Picking hotels that fit your budget…",
    "Mapping out each day…",
    "Almost there…",
];

const NEXT_STEPS = [
    "Gemini drafts your hotels and day-by-day plan. This takes about 15 seconds.",
    "The trip is saved to My Trips automatically.",
    "Open it any time and share the link with your travel companions.",
];

/** Maps a failure to a message the user can act on. */
function failureMessage(error) {
    switch (error?.code) {
        case "ai_unavailable":
            return "The AI service is busy right now. Please try again in a minute.";
        case "rate_limited":
            return "You've reached the hourly trip limit. Please try again later.";
        case "unauthorized":
            return "Your session expired. Please sign in again.";
        case "invalid_request":
            return error.message;
        case "ai_misconfigured":
            return "The AI service is not set up correctly. Please contact the site owner.";
        case "ai_error":
        case "bad_response":
            return "The AI returned an unexpected response. Please try again.";
        case "network":
            return "We couldn't reach the server. Check your connection and try again.";
        default:
            return "We couldn't create your trip. Please try again.";
    }
}

const clampDays = (n) => Math.min(Math.max(Math.round(n), MIN_DAYS), MAX_DAYS);

function Step({ number, title, done, children }) {
    return (
        <section className="rounded-2xl border border-border-strong bg-card p-5 sm:p-6">
            <h2 className="display-md flex items-center gap-3">
                <span
                    className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors",
                        done ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground"
                    )}
                >
                    {done ? <Check className="h-4 w-4" /> : number}
                </span>
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function OptionCard({ selected, onSelect, icon: Icon, title, desc }) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className={cn(
                "flex cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
                selected ? "border-2 border-foreground bg-muted" : "border-border-strong bg-white hover:border-foreground"
            )}
        >
            <Icon className={cn("h-6 w-6", selected ? "text-brand-600" : "text-foreground")} aria-hidden="true" />
            <span>
                <span className="block font-semibold">{title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{desc}</span>
            </span>
        </button>
    );
}

function SummaryRow({ icon: Icon, label, value }) {
    return (
        <li className="flex items-start gap-3 py-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={cn("truncate font-semibold", !value && "font-normal text-muted-foreground")}>{value || "Not chosen yet"}</p>
            </div>
        </li>
    );
}

function Create() {
    const { user, requestLogin, getToken } = useAuth();
    const navigate = useNavigate();
    const { state: startValues } = useLocation();
    // Optional starting values from the landing page search bar.
    const [form, setForm] = useState(() => ({
        ...(startValues?.destination && { destination: { label: startValues.destination } }),
        ...(Number.isFinite(startValues?.days) && { DaysCount: clampDays(startValues.days) }),
        ...(BudgetCategories.some((b) => b.mtitle === startValues?.budget) && { Budget: startValues.budget }),
    }));
    const [loading, setLoading] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

    // Rotate the progress message while the model is working (typically 10-20s).
    useEffect(() => {
        if (!loading) return;
        const id = setInterval(() => setMessageIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1)), 4500);
        return () => {
            clearInterval(id);
            setMessageIndex(0);
        };
    }, [loading]);

    const handleDays = (e) => {
        const raw = e.target.value;
        if (raw === "") return setField("DaysCount", "");
        const n = Math.round(Number(raw));
        if (n > MAX_DAYS) toast.info(`Trips are limited to ${MAX_DAYS} days.`);
        setField("DaysCount", clampDays(n));
    };

    const validate = () => {
        if (!form.destination?.label) return "Choose a destination.";
        if (!form.DaysCount) return `Enter a number of days (${MIN_DAYS}-${MAX_DAYS}).`;
        if (!form.Budget) return "Select a budget.";
        if (!form.PeopleCount) return "Select who you're travelling with.";
        return null;
    };

    const completed = [form.destination?.label, form.DaysCount, form.Budget, form.PeopleCount].filter(Boolean).length;
    const group = SelectTravelList.find((t) => t.people === form.PeopleCount)?.mtitle;

    // Takes the user explicitly: right after sign-in, the `user` in this closure is still stale.
    const generate = async (currentUser) => {
        const problem = validate();
        if (problem) return toast.error(problem);

        // The server needs a fresh login token. If it expired (or the tab was reopened), sign in again first.
        const token = getToken();
        if (!token) return requestLogin(generate);

        setLoading(true);
        try {
            const tripData = await generateTripPlan(
                {
                    destination: form.destination.label,
                    days: form.DaysCount,
                    travelers: form.PeopleCount,
                    budget: form.Budget,
                },
                token
            );
            // Random, unguessable id: trip URLs are shareable, so they must not be enumerable.
            const id = crypto.randomUUID();
            await setDoc(doc(db, "AI-Trips", id), {
                id,
                userEmail: currentUser.email,
                createdAt: Date.now(),
                userLocation: { ...form, destination: { label: form.destination.label } },
                tripData,
            });
            navigate(`/view-trip/${id}`);
        } catch (error) {
            console.error("Trip generation failed:", error);
            toast.error(failureMessage(error));
            setLoading(false);
        }
    };

    const onGenerate = () => (user ? generate(user) : requestLogin(generate));

    return (
        <div className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6 lg:pb-16 lg:pt-12">
            <h1 className="display-xl">Plan your trip</h1>
            <p className="mt-2 text-lg text-muted-foreground">Four quick questions, then we&apos;ll build your itinerary.</p>

            <div className="mt-8 grid gap-10 lg:grid-cols-12">
                <div className="flex flex-col gap-5 lg:col-span-7">
                    <Step number={1} done={Boolean(form.destination?.label)} title="Where do you want to go?">
                        <DestinationSearch value={form.destination ?? null} onChange={(v) => setField("destination", v)} />
                    </Step>

                    <Step number={2} done={Boolean(form.DaysCount)} title={`How many days? (${MIN_DAYS}-${MAX_DAYS})`}>
                        <Input
                            type="number"
                            inputMode="numeric"
                            min={MIN_DAYS}
                            max={MAX_DAYS}
                            value={form.DaysCount ?? ""}
                            onChange={handleDays}
                            placeholder="e.g. 3"
                            aria-label="Number of days"
                        />
                        <div className="mt-3 flex flex-wrap gap-2">
                            {Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i).map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    aria-pressed={form.DaysCount === d}
                                    aria-label={`${d} ${d === 1 ? "day" : "days"}`}
                                    onClick={() => setField("DaysCount", d)}
                                    className={cn(
                                        "h-10 min-w-10 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors",
                                        form.DaysCount === d ? "border-foreground bg-foreground text-white" : "border-border-strong hover:border-foreground"
                                    )}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </Step>

                    <Step number={3} done={Boolean(form.Budget)} title="What's your budget?">
                        <div className="grid gap-3 sm:grid-cols-3">
                            {BudgetCategories.map((b) => (
                                <OptionCard
                                    key={b.id}
                                    icon={b.icon}
                                    title={b.mtitle}
                                    desc={b.desc}
                                    selected={form.Budget === b.mtitle}
                                    onSelect={() => setField("Budget", b.mtitle)}
                                />
                            ))}
                        </div>
                    </Step>

                    <Step number={4} done={Boolean(form.PeopleCount)} title="Who's travelling?">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {SelectTravelList.map((t) => (
                                <OptionCard
                                    key={t.id}
                                    icon={t.icon}
                                    title={t.mtitle}
                                    desc={t.desc}
                                    selected={form.PeopleCount === t.people}
                                    onSelect={() => setField("PeopleCount", t.people)}
                                />
                            ))}
                        </div>
                    </Step>
                </div>

                {/* Booking-style summary card: sticky on desktop; mobile gets the bottom bar below. */}
                <aside className="hidden lg:col-span-5 lg:block" aria-label="Your trip">
                    <div className="sticky top-24 overflow-hidden rounded-2xl border border-border-strong bg-card shadow-lift">
                        <PlacePhoto
                            query={form.destination?.label}
                            alt={form.destination?.label ?? ""}
                            icon={MapPin}
                            className="aspect-[3/2]"
                        />
                        <div className="p-6">
                            <h2 className="display-md">Your trip</h2>
                            <ul className="mt-2 divide-y divide-border">
                                <SummaryRow icon={MapPin} label="Destination" value={form.destination?.label} />
                                <SummaryRow icon={CalendarDays} label="Duration" value={form.DaysCount ? `${form.DaysCount} ${form.DaysCount === 1 ? "day" : "days"}` : ""} />
                                <SummaryRow icon={Wallet} label="Budget" value={form.Budget} />
                                <SummaryRow icon={Users} label="Travelling as" value={group} />
                            </ul>
                            <Button size="lg" className="mt-4 w-full" disabled={loading} onClick={onGenerate}>
                                <Sparkles className="h-5 w-5" aria-hidden="true" /> Generate my trip
                            </Button>
                            <div className="mt-6 border-t border-border pt-5">
                                <h3 className="text-sm font-semibold">What happens next</h3>
                                <ol className="mt-3 space-y-3">
                                    {NEXT_STEPS.map((s, i) => (
                                        <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-foreground">{i + 1}</span>
                                            {s}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile: what happens next + sticky action bar */}
            <section className="mt-8 rounded-2xl bg-muted p-5 lg:hidden" aria-label="What happens next">
                <h2 className="text-sm font-semibold">What happens next</h2>
                <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {NEXT_STEPS.map((s, i) => (
                        <li key={s}>{i + 1}. {s}</li>
                    ))}
                </ol>
            </section>
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white px-4 py-3 shadow-lift lg:hidden">
                <div className="mx-auto flex max-w-xl items-center gap-4">
                    <p className="shrink-0 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{completed}/4</span> done
                    </p>
                    <Button size="lg" className="flex-1" disabled={loading} onClick={onGenerate}>
                        <Sparkles className="h-5 w-5" aria-hidden="true" /> Generate my trip
                    </Button>
                </div>
            </div>

            {loading && (
                <div role="status" aria-live="polite" className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-6">
                    <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-8 text-center shadow-lift">
                        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
                        <h2 className="display-md mt-5">Building your trip to {form.destination?.label?.split(",")[0]}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{LOADING_MESSAGES[messageIndex]}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Create;
