import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { searchDestinations } from "@/AI/geocode";
import { cn } from "@/lib/utils";

/**
 * Accessible destination combobox (WAI-ARIA combobox + listbox pattern).
 * `value` is `{ label }` or null; `onChange` receives `{ label }` once the user picks an option,
 * and null while they are editing. If the lookup service is unreachable, the typed text itself
 * can be used so the user is never blocked.
 */
function DestinationSearch({ value, onChange, placeholder = "Search a city or country…" }) {
    const listId = useId();
    const [text, setText] = useState(value?.label ?? "");
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resolvedFor, setResolvedFor] = useState(null); // the text the current `options` belong to
    const [active, setActive] = useState(-1);
    const rootRef = useRef(null);
    const typed = text.trim();
    const selected = value?.label === typed;

    // Debounced lookup; each keystroke cancels the previous request.
    useEffect(() => {
        if (typed.length < 2 || selected) return;
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                setOptions(await searchDestinations(typed, { signal: controller.signal }));
                setResolvedFor(typed);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setOptions([]);
                    setResolvedFor(typed); // lookup failed: let the user continue with what they typed
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 300);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [typed, selected]);

    useEffect(() => {
        const close = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const pick = (label) => {
        setText(label);
        setOpen(false);
        setActive(-1);
        onChange({ label });
    };

    // The list is the geocoder's results plus a "use what I typed" row, offered only once the
    // lookup for the current text has finished (otherwise a fast Enter would pick the raw text).
    const settled = resolvedFor === typed;
    const rows = [
        ...(settled ? options.map((o) => o.label) : []),
        ...(settled && typed.length >= 2 && !options.some((o) => o.label === typed) ? [typed] : []),
    ];
    const showList = open && typed.length >= 2 && !selected;

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, rows.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && showList && rows.length) {
            e.preventDefault();
            pick(rows[active >= 0 ? active : 0]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <div ref={rootRef} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
                type="text"
                role="combobox"
                aria-label="Destination"
                aria-expanded={showList}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                autoComplete="off"
                value={text}
                placeholder={placeholder}
                onChange={(e) => {
                    setText(e.target.value);
                    setOpen(true);
                    setActive(-1);
                    if (value) onChange(null);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15"
            />
            {loading && <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden="true" />}

            {showList && rows.length > 0 && (
                <ul id={listId} role="listbox" className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg">
                    {rows.map((label, i) => {
                        const isTyped = i === rows.length - 1 && !options.some((o) => o.label === label);
                        return (
                            <li
                                key={`${label}-${i}`}
                                id={`${listId}-${i}`}
                                role="option"
                                aria-selected={i === active}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => pick(label)}
                                onMouseEnter={() => setActive(i)}
                                className={cn("flex cursor-pointer items-center gap-3 px-4 py-3 text-sm", i === active && "bg-muted")}
                            >
                                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                <span className="truncate">{isTyped ? `Use “${label}”` : label}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default DestinationSearch;
