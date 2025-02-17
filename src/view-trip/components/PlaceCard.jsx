import { GetPlaceDetails, PHOTO_REF_URL } from '@/AI/GlobalApi';
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCard({ place }) {
  const [isActive, setIsActive] = useState(false);
  const [photoUrl, setPhotoUrl] = useState();
  
  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place?.placeName
    };

    try {
      const result = await GetPlaceDetails(data);
      const photos = result?.data?.places[0]?.photos;
      if (photos && photos.length > 3) {
        const photoRef = photos[3].name;
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
        setPhotoUrl(PhotoUrl);
      } else if (photos && photos.length > 0) {
        const photoRef = photos[0].name;
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
        setPhotoUrl(PhotoUrl);
      } else {
        setPhotoUrl('/trip.jpg');
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setPhotoUrl('/trip.jpg');
    }
  };

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName} target="_blank">
      <div 
        className="rounded-xl p-3 mt-5 flex gap-5 cursor-pointer 
                   transition-transform transition-shadow duration-300 ease-in-out 
                   bg-white shadow-md 
                   hover:bg-yellow-300 hover:shadow-xl hover:scale-105"
      >
        <img 
          src={photoUrl ? photoUrl : '/trip.jpg'} 
          className='w-[100px] h-[130px] rounded-xl object-cover'
          alt={place?.placeName}
        />
        <div>
          <h2 className='font-bold text-lg'>{place?.placeName}</h2>
          <p className='text-sm text-gray-400 mt-2'>{place?.placeDetails}</p>
          <p className='text-sm text-black-400 mt-2 my-2'>💸 {place?.ticketPricing}</p>
          <Button><FaLocationDot /></Button>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;