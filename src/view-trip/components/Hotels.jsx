import { SectionHeading } from "@/components/ui/section-heading";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }) {
    const hotels = trip?.tripData?.hotelOptions ?? [];
    if (hotels.length === 0) return null;

    return (
        <section id="hotels" className="scroll-mt-24">
            <SectionHeading title="Where to stay" description="Suggested hotels for your budget. Tap one to open it in Google Maps." />
            <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                {hotels.map((hotel) => (
                    <HotelCardItem key={`${hotel.hotelName}-${hotel.hotelAddress}`} hotel={hotel} />
                ))}
            </div>
        </section>
    );
}

export default Hotels;
