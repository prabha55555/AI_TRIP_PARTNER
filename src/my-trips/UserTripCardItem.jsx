import React from 'react'
import { useState,useEffect } from 'react';
import { GetPlaceDetails } from '@/AI/GlobalApi';
import { PHOTO_REF_URL } from '@/AI/GlobalApi';
import { Link } from 'react-router-dom';

function UserTripCardItem({trip}) {
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
        
       <Link to={'/view-trip/'+trip.id} className="hover:scale-105 transition-all  cursor-pointer">
    <div>
      <img src={photoUrl?photoUrl:'/trip.jpg'} alt=""className="object-cover rounded-xlh-[220px]" />
      <div>
        <h2 className='font-bold text-lg'>{trip?.userLocation?.destination?.label}</h2>
        <h2 className='text-sm text-gray-500'>{trip?.userLocation?.DaysCount} Days Trip with {trip?.userLocation?.Budget}</h2>
      </div>
    </div>
    </Link>
  )
}


export default UserTripCardItem
