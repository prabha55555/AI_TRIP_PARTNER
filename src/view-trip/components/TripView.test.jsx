import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Hotels from "./Hotels";
import InfoSection from "./InfoSection";
import PlacesToVisit from "./PlacesToVisit";

// Photos come from the network; tests only care about rendering.
vi.mock("@/AI/GlobalApi.jsx", () => ({ usePlacePhoto: () => ({ url: "/trip.jpg", loading: false }) }));
vi.mock("@/AI/GlobalApi", () => ({ usePlacePhoto: () => ({ url: "/trip.jpg", loading: false }) }));

const trip = {
    userLocation: { destination: { label: "Paris, France" }, DaysCount: 2, Budget: "Medium Budget", PeopleCount: "2 people" },
    tripData: {
        hotelOptions: [
            { hotelName: "Hotel A", hotelAddress: "1 Rue A", price: "$100", rating: 4.5 },
            { hotelName: "Hotel B", hotelAddress: "2 Rue B", price: "$80" }, // no rating
        ],
        itinerary: {
            // deliberately out of order: day10 must sort after day2
            day10: { theme: "Last", plan: [{ placeName: "Louvre", placeDetails: "Art", ticketPricing: "$20", rating: 4.8, timeTravel: "3h" }] },
            day2: { theme: "Second", bestTimeToVisit: "Morning", plan: [{ placeName: "Eiffel Tower" }] },
        },
    },
};

afterEach(cleanup);

describe("trip view", () => {
    it("InfoSection shows destination, days, budget, group", () => {
        render(<InfoSection trip={trip} />);
        expect(screen.getByRole("heading", { name: "Paris, France" })).toBeTruthy();
        expect(screen.getByText("2 days")).toBeTruthy();
        expect(screen.getByText("Medium Budget")).toBeTruthy();
        expect(screen.getByText("2 people")).toBeTruthy();
    });

    it("Hotels renders every hotel and tolerates a missing rating", () => {
        render(<Hotels trip={trip} />);
        expect(screen.getByText("Hotel A")).toBeTruthy();
        expect(screen.getByText("Hotel B")).toBeTruthy();
    });

    it("Hotels renders nothing when the AI returned no hotels", () => {
        const { container } = render(<Hotels trip={{ tripData: {} }} />);
        expect(container.innerHTML).toBe("");
    });

    it("PlacesToVisit sorts days numerically (day2 before day10) and renders places", () => {
        render(<PlacesToVisit trip={trip} />);
        const days = screen.getAllByRole("heading", { level: 3 }).map((h) => Number(h.textContent.replace(/\D/g, "")));
        expect(days).toEqual([2, 10]);
        expect(screen.getByText("Eiffel Tower")).toBeTruthy();
        expect(screen.getByText("Louvre")).toBeTruthy();
    });

    it("PlacesToVisit builds a per-day Google Maps route link and collapsible days (open by default)", () => {
        const { container } = render(<PlacesToVisit trip={trip} />);
        expect(container.querySelectorAll("details[open]")).toHaveLength(2);
        expect(screen.getAllByText("Open day route in Google Maps").length).toBeGreaterThan(0);
    });

    it("PlacesToVisit handles an empty itinerary without crashing", () => {
        render(<PlacesToVisit trip={{ tripData: {} }} />);
        expect(screen.getByText("No itinerary available.")).toBeTruthy();
    });

    it("PlacesToVisit tolerates a day whose plan is not an array", () => {
        render(<PlacesToVisit trip={{ tripData: { itinerary: { day1: { plan: "oops" } } } }} />);
        expect(screen.getByRole("heading", { name: "Day 1" })).toBeTruthy();
    });
});
