import { Check, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BudgetCategories, MAX_DAYS, MIN_DAYS } from "@/create/option.jsx";

const TRUST = ["Free to try", "Sign in with Google", "Saved to My Trips"];

const segment =
    "flex min-w-0 flex-1 flex-col justify-center px-6 py-3 text-left transition-colors hover:bg-muted focus-within:bg-muted";
const fieldLabel = "text-xs font-bold";
const fieldInput =
    "w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none";

function Hero() {
    const navigate = useNavigate();
    const [destination, setDestination] = useState("");
    const [days, setDays] = useState("3");
    const [budget, setBudget] = useState("");

    // The create page accepts these as optional starting values; it works fine without them.
    const submit = (e) => {
        e.preventDefault();
        navigate("/create", {
            state: { destination: destination.trim() || undefined, days: Number(days), budget: budget || undefined },
        });
    };

    return (
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
                <h1 className="display-xl">Plan your perfect trip in minutes</h1>
                <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                    Tell us where you want to go, for how long and on what budget. TravelBeam builds a day-by-day itinerary with hotels and places to visit.
                </p>

                <form
                    onSubmit={submit}
                    aria-label="Plan a trip"
                    className="mt-8 flex flex-col overflow-hidden rounded-3xl border border-border-strong bg-white shadow-soft sm:rounded-full md:flex-row md:items-stretch"
                >
                    <label className={`${segment} md:flex-[1.4]`}>
                        <span className={fieldLabel}>Destination</span>
                        <input
                            className={fieldInput}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Search a place"
                            autoComplete="off"
                        />
                    </label>
                    <span className="hidden w-px self-center bg-border md:block md:h-8" aria-hidden="true" />
                    <label className={`${segment} border-t border-border md:border-t-0`}>
                        <span className={fieldLabel}>Days</span>
                        <select className={`${fieldInput} -ml-1`} value={days} onChange={(e) => setDays(e.target.value)}>
                            {Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i).map((d) => (
                                <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                            ))}
                        </select>
                    </label>
                    <span className="hidden w-px self-center bg-border md:block md:h-8" aria-hidden="true" />
                    <label className={`${segment} border-t border-border md:border-t-0`}>
                        <span className={fieldLabel}>Budget</span>
                        <select className={`${fieldInput} -ml-1`} value={budget} onChange={(e) => setBudget(e.target.value)}>
                            <option value="">Any budget</option>
                            {BudgetCategories.map((b) => (
                                <option key={b.id} value={b.mtitle}>{b.mtitle}</option>
                            ))}
                        </select>
                    </label>
                    <div className="p-2 md:flex md:items-center">
                        <button
                            type="submit"
                            aria-label="Plan my trip"
                            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-600 px-5 font-semibold text-white transition-colors hover:bg-brand-700 md:w-12 md:px-0"
                        >
                            <Search className="h-5 w-5" aria-hidden="true" />
                            <span className="md:hidden">Plan my trip</span>
                        </button>
                    </div>
                </form>

                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {TRUST.map((t) => (
                        <li key={t} className="inline-flex items-center gap-2">
                            <Check className="h-4 w-4 text-brand-600" aria-hidden="true" /> {t}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Photo collage from the local images */}
            <div className="grid h-80 grid-cols-2 grid-rows-2 gap-3 sm:h-[26rem] lg:h-[30rem]" aria-hidden="true">
                <img src="/balloon.jpg" alt="" fetchPriority="high" className="row-span-2 h-full w-full rounded-2xl object-cover" />
                <img src="/worldd.jpg" alt="" className="h-full w-full rounded-2xl object-cover" />
                <img src="/aero.jpg" alt="" className="h-full w-full rounded-2xl object-cover" />
            </div>
        </section>
    );
}

export default Hero;
