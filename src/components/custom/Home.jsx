import { ArrowRight, Bed, CalendarDays, CircleCheck, Clock, MapPinned, MousePointerClick, Share2, Sparkles, Ticket, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import Hero from "./Hero";

const STEPS = [
    { icon: MousePointerClick, title: "Tell us the basics", text: "Choose a destination, the number of days, your budget and who is travelling." },
    { icon: Sparkles, title: "AI drafts your plan", text: "Google Gemini writes a hotel shortlist and a plan for every day. It usually takes around 15 seconds." },
    { icon: CalendarDays, title: "Save and share", text: "The trip is saved to My Trips automatically, and you can share its link with anyone." },
];

const FEATURES = [
    { icon: Bed, title: "Hotel shortlist", text: "A few stays with a price range, rating and a short description, matched to your budget." },
    { icon: CalendarDays, title: "Day-by-day itinerary", text: "Every day has a theme, the best time to visit and a list of places to see." },
    { icon: Ticket, title: "Practical details", text: "Ticket pricing, ratings and suggested time at each place, so you know what to expect." },
    { icon: MapPinned, title: "Google Maps ready", text: "Open any hotel or place in Google Maps, or a whole day's route in one tap." },
];

const TILES = [
    { img: "/balloon.jpg", title: "Hot-air balloon flights" },
    { img: "/worldd.jpg", title: "Around the world" },
    { img: "/aero.jpg", title: "Famous landmarks" },
    { img: "/fun.jpg", title: "Adventures with friends" },
];

const POPULAR = ["Paris, France", "Tokyo, Japan", "Bali, Indonesia", "Rome, Italy", "New York, USA", "Dubai, UAE", "Lisbon, Portugal", "Bangkok, Thailand"];

const BENEFITS = [
    { icon: Clock, title: "Save planning time", text: "Skip hours of tabs and spreadsheets and start from a complete draft." },
    { icon: Wallet, title: "Fits your budget", text: "Choose low, medium or high and the suggestions follow." },
    { icon: CircleCheck, title: "Everything in one place", text: "Hotels, places and timings live together in a single trip page." },
    { icon: Share2, title: "Easy to share", text: "Send one link to your travel companions." },
];

function Home() {
    return (
        <>
            <Hero />

            <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                <SectionHeading title="Popular destinations" description="Get inspired by a style of trip, or start from a favourite place." />
                <div className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
                    {TILES.map((t) => (
                        <Link key={t.title} to="/create" className="group w-64 shrink-0 snap-start sm:w-72 lg:w-auto">
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                                <img src={t.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                            </div>
                            <h3 className="mt-3 font-semibold">{t.title}</h3>
                            <p className="text-sm text-muted-foreground">Plan something like this</p>
                        </Link>
                    ))}
                </div>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Popular destinations">
                    {POPULAR.map((p) => (
                        <li key={p}>
                            <Link
                                to="/create"
                                state={{ destination: p }}
                                className="inline-flex min-h-10 items-center rounded-full border border-border-strong px-4 text-sm font-medium transition-colors hover:border-foreground hover:bg-muted"
                            >
                                {p}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section id="how-it-works" className="scroll-mt-20 bg-muted py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <SectionHeading title="How it works" description="From idea to itinerary in three steps." />
                    <ol className="mt-8 grid gap-6 md:grid-cols-3">
                        {STEPS.map(({ icon: Icon, title, text }, i) => (
                            <li key={title} className="rounded-2xl border border-border bg-white p-6">
                                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
                                    <Icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                                <p className="mt-5 text-sm font-semibold text-muted-foreground">Step {i + 1}</p>
                                <h3 className="display-md mt-1">{title}</h3>
                                <p className="mt-2 text-muted-foreground">{text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <SectionHeading title="What your itinerary includes" description="Generated for your destination, days, budget and group, and saved in one place." />
                <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                    {FEATURES.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex gap-4">
                            <Icon className="mt-0.5 h-7 w-7 shrink-0 text-brand-600" aria-hidden="true" />
                            <div>
                                <h3 className="display-md">{title}</h3>
                                <p className="mt-1 text-muted-foreground">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y border-border bg-muted py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <SectionHeading title="Why TravelBeam" description="Planning that stays out of your way." />
                    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {BENEFITS.map(({ icon: Icon, title, text }) => (
                            <li key={title}>
                                <Icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                                <h3 className="display-md mt-3">{title}</h3>
                                <p className="mt-1 text-muted-foreground">{text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="rounded-3xl bg-brand-600 px-6 py-14 text-center text-white sm:px-12">
                    <h2 className="display-xl text-white">Ready to plan your next trip?</h2>
                    <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">It takes a minute to fill in, and your itinerary is saved to My Trips.</p>
                    <Button asChild size="lg" variant="light" className="mt-8">
                        <Link to="/create">
                            Start planning <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}

export default Home;
