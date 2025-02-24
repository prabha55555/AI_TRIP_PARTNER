import React from 'react'
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { GetPlaceDetails } from '@/AI/GlobalApi';
import { PHOTO_REF_URL } from '@/AI/GlobalApi';

function HotelCardItem({hotel}) {
 const[photoUrl,setPhotoUrl]=useState();

    useEffect(() => {
        hotel&&GetPlacePhoto();
    }, [hotel])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: hotel?.hotelName
        }
        
            const result = await GetPlaceDetails(data).then(resp=>{
                console.log(resp.data.places[0].photos[3].name);

               const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name) ;
               setPhotoUrl(PhotoUrl);
            })
        }

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel.hotelName+","+hotel?.hotelAddress} target="_blank">  
    <div className="scale-100 transition-all cursor-pointer">
        <img src={photoUrl?photoUrl:'/trip.jpg'} className='rounded-xl mt-3 h-[180px] w-full object-cover  hover:shadow-xl hover:scale-105 '/>
        <div className="my-2 flex flex-col gap-2  hover:bg-amber-400" >
            <h2 className="font-medium">{hotel?.hotelName}</h2>
            <h2 className="text-xs text-grey-500 mt-2"> 📌 {hotel?.hotelAddress}</h2>
            <h2 className="text-sm"> 💰 {hotel?.price}</h2>
            <h2 className="text-sm"> ⭐ {hotel?.rating}</h2>
           
        </div>

       </div>  
    </Link>
  )
}

export default HotelCardItem
