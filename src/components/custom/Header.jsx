import { LogOut, Map, Menu, Plus, Search, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/auth";
import { profileInitial } from "@/lib/profile";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const navLinkClass = ({ isActive }) =>
    cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    );

/** Profile photo with an initial-letter fallback if the image is missing or fails to load. */
function Avatar({ user }) {
    const [failed, setFailed] = useState(false);
    if (!user.picture || failed) {
        const initial = profileInitial(user);
        return (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-sm font-bold text-white" aria-hidden="true">
                {initial || <User className="h-5 w-5" />}
            </span>
        );
    }
    return (
        <img
            src={user.picture}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-10 w-10 rounded-full border border-border bg-muted object-cover"
        />
    );
}

function Header() {
    const { user, requestLogin, signOut } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [menuOpenAt, setMenuOpenAt] = useState(null);
    // The menu auto-closes on navigation: it is "open" only for the path it was opened on.
    const menuOpen = menuOpenAt === pathname;

    const handleSignOut = () => {
        signOut();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-white">
            <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
                <Link to="/" className="flex items-center gap-2.5 justify-self-start" aria-label="TravelBeam home">
                    <Logo />
                    <span className="text-xl font-extrabold tracking-tight text-brand-600">TravelBeam</span>
                </Link>

                {/* Compact search pill: always one click from planning a trip. */}
                <Link
                    to="/create"
                    className="hidden items-center gap-3 rounded-full border border-border-strong bg-white py-1.5 pl-5 pr-1.5 text-sm font-semibold shadow-sm transition-shadow hover:shadow-soft md:flex"
                    aria-label="Plan a trip"
                >
                    <span>Plan a trip</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white">
                        <Search className="h-4 w-4" aria-hidden="true" />
                    </span>
                </Link>

                <div className="flex items-center gap-1 justify-self-end">
                    {user ? (
                        <>
                            <nav className="hidden items-center sm:flex" aria-label="Primary">
                                <NavLink to="/my-trips" className={navLinkClass}>My trips</NavLink>
                            </nav>
                            <Popover>
                                <PopoverTrigger className="ml-1 rounded-full" aria-label="Account menu">
                                    <Avatar user={user} />
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-64 rounded-2xl p-2 shadow-lift">
                                    <div className="px-3 py-2">
                                        <p className="truncate text-sm font-semibold">{user.name}</p>
                                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="my-1 h-px bg-border" />
                                    <button
                                        onClick={handleSignOut}
                                        className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-danger hover:bg-muted"
                                    >
                                        <LogOut className="h-4 w-4" /> Sign out
                                    </button>
                                </PopoverContent>
                            </Popover>
                            <button
                                className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted sm:hidden"
                                onClick={() => setMenuOpenAt(menuOpen ? null : pathname)}
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={menuOpen}
                            >
                                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => requestLogin()}>
                            Sign in
                        </Button>
                    )}
                </div>
            </div>

            {user && menuOpen && (
                <nav className="border-t border-border bg-white p-3 sm:hidden" aria-label="Mobile">
                    <Link to="/create" className="flex min-h-12 items-center gap-3 rounded-xl px-4 font-medium hover:bg-muted">
                        <Plus className="h-5 w-5 text-brand-600" /> New trip
                    </Link>
                    <Link to="/my-trips" className="flex min-h-12 items-center gap-3 rounded-xl px-4 font-medium hover:bg-muted">
                        <Map className="h-5 w-5 text-brand-600" /> My trips
                    </Link>
                </nav>
            )}
        </header>
    );
}

export default Header;
