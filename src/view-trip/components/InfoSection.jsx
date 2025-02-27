import { GetPlaceDetails } from "@/AI/GlobalApi.jsx"; // Import the GetPlaceDetails function
import { Button } from "@material-tailwind/react";
import { useState,useEffect } from "react";
import { HiShare } from "react-icons/hi";
import React from "react";


const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key='+import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

function InfoSection({ trip }) {
    const[photoUrl,setPhotoUrl]=useState();

    useEffect(() => {
        trip&&GetPlacePhoto();
    }, [trip])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.userLocation?.destination?.label
        }
        
            const result = await GetPlaceDetails(data).then(resp=>{
                console.log(resp.data.places[0].photos[3].name);

               const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name) ;
               setPhotoUrl(PhotoUrl);
            })
       
    }

    return (
        <div className="space-y-4">
            <img
                src={photoUrl?photoUrl:'/trip.jpg'}
                className="h-[340px] w-full object-cover rounded-2xl"
            />
            <div className="flex justify-between items-start">
                <div className="mt-5 flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">
                        {trip?.userLocation?.destination?.label}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <h2 className="p-2 bg-amber-50 rounded-full text-black font-semibold flex items-center text-x5 md:text-md">
                            🗓️ {trip.userLocation?.DaysCount} Days
                        </h2>
                        <h2 className="p-2 bg-amber-50 rounded-full text-black font-semibold flex items-center text-x5 md:text-md ">
                            💸 {trip.userLocation?.Budget}
                        </h2>
                        <h2 className="p-2 bg-amber-50 rounded-full text-black font-semibold flex items-center text-x5 md:text-md">
                            🧍🏿 {trip.userLocation?.PeopleCount}
                        </h2>
                    </div>
                </div>
                <Button className="mt-5">
                    <HiShare size={20} />
                </Button>
            </div>
        </div>
    );
}

export default InfoSection;
