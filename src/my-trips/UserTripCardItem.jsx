import React, { useState, useEffect } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/AI/GlobalApi';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const [photoUrl, setPhotoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
        if (trip) {
            GetPlacePhoto();
        }
        
        // Cleanup function to handle component unmounting
        return () => {
            setPhotoUrl('');
            setIsLoading(false);
        };
    }, [trip]);
    
    const GetPlacePhoto = async () => {
        setIsLoading(true);
        setHasError(false);
        
        if (!trip?.userLocation?.destination?.label) {
            console.log("No destination label found for trip:", trip?.id);
            setIsLoading(false);
            setHasError(true);
            return;
        }
        
        try {
            console.log("Fetching photo for:", trip.userLocation.destination.label);
            const data = { textQuery: trip.userLocation.destination.label };
            const result = await GetPlaceDetails(data);
            
            // Log the API response to debug
            console.log("API response:", result);
            
            // Try different photo indices if the 4th one isn't available
            let photoName = null;
            const photos = result?.data?.places?.[0]?.photos || [];
            
            if (photos.length > 0) {
                // Try index 3 first (4th photo), but fall back to others if needed
                photoName = photos[3]?.name || photos[0]?.name;
                console.log("Photo name found:", photoName);
            }
            
            if (photoName) {
                const url = PHOTO_REF_URL.replace('{NAME}', photoName);
                console.log("Setting photo URL:", url);
                setPhotoUrl(url);
            } else {
                console.log("No photos found for:", trip.userLocation.destination.label);
                setHasError(true);
            }
        } catch (error) {
            console.error("Error fetching place photo:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle image load errors
    const handleImageError = (e) => {
        console.log("Image failed to load:", e.target.src);
        e.target.onerror = null; // Prevent infinite error loops
        e.target.src = '/trip.jpg'; // Set to default image
        setHasError(true);
    };
    
    return (
        <Link to={`/view-trip/${trip.id}`} className="block w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] mx-auto">
            <div className="p-3 md:p-6 bg-white shadow-md rounded-lg w-full text-center 
                        transition-all duration-300 ease-in-out
                        hover:shadow-lg hover:border-[rgb(0,137,132)] hover:border 
                        active:scale-95 
                        sm:hover:scale-[1.02] sm:hover:-translate-y-1">
                {/* Image Section (Contained and Responsive) */}
                <div className="w-full h-[180px] sm:h-[200px] md:h-[250px] mx-auto relative overflow-hidden rounded-lg">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    ) : (
                        <img
                            src={photoUrl || '/trip.jpg'}
                            alt={`Trip to ${trip?.userLocation?.destination?.label || 'Destination'}`}
                            className="w-full h-full object-cover rounded-lg
                                    transition-all duration-500 ease-in-out
                                    hover:scale-105 hover:brightness-105"
                            onError={handleImageError}
                        />
                    )}
                </div>
                
                <div className="w-full mt-3 md:mt-4 px-1">
                    <h2 className="font-bold text-base md:text-lg lg:text-xl truncate
                               text-gray-800 transition-colors duration-300 
                               group-hover:text-[rgb(0,137,132)]">
                        {trip?.userLocation?.destination?.label || 'Trip Destination'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                        {trip?.userLocation?.DaysCount || '0'} Days Trip • Budget: {trip?.userLocation?.Budget || 'N/A'}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default UserTripCardItem;