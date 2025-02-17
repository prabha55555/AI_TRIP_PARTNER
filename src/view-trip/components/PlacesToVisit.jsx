import React from 'react';
import PlaceCard from './PlaceCard';

function PlacesToVisit({ trip }) {
    const itinerary = trip.tripData?.itinerary || {};

    const formatDayKey = (dayKey) => {
        const dayNumber = parseInt(dayKey.replace('day', ''), 10);
        return `Day ${dayNumber}`;
    };

    const sortedDayKeys = Object.keys(itinerary).sort((a, b) => {
        const dayA = parseInt(a.replace('day', ''), 10);
        const dayB = parseInt(b.replace('day', ''), 10);
        return dayA - dayB;
    });

    return (
        <div>
            <h2 className="font-bold text-lg mt-5">Places to Visit</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                {sortedDayKeys.length > 0 ? (
                    sortedDayKeys.map((dayKey, index) => (
                        <div key={index} className="mb-5">
                            <h2 className="font-medium text-lg">{formatDayKey(dayKey)}</h2>
                            <h2 className="font-medium text-sm text-black-600 my-5"> 🔗 Best Time to Visit: {itinerary[dayKey].bestTimeToVisit}</h2>
                            {Array.isArray(itinerary[dayKey].plan) && itinerary[dayKey].plan.map((place, idx) => (
                                <div key={idx} className="ml-5 mt-2">
                                    <h2 className="font-medium text-sm text-orange-600 my-5">🕙 {place.timeTravel}</h2>
                                    <PlaceCard place={place} /> 
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No itinerary available.</p>
                )}
            </div>
        </div>
    );
}

export default PlacesToVisit;