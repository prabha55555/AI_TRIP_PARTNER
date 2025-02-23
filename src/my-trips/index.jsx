import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { db } from '../AI/firebase';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { useState } from 'react';
import { User } from 'lucide-react';
import UserTripCardItem from './UserTripCardItem';


function MyTrips() {
    const navigate = useNavigate(); 
    const [userTrips,setUserTrips]=useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        
       
        if (!user) {
            navigate('/'); 
            return;
        }

       
        const q = query(collection(db, 'AI-Trips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([]);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setUserTrips(preVal=>[...preVal,doc.data()]);
        });
    }

        return (
<div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-0 bg-[rgb(0,137,132)] h-auto min-h-screen pb-10">
                
            <h2 className='font-bold text-3xl '>My Trips</h2>
 
            <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-10'>
                {userTrips?.length>0?userTrips.map((trip, index) => (
                <UserTripCardItem key={index} trip={trip} />
                ))
                :[1,2,3,4,5,6,7,8,9,10].map((item,index)=>(
                    <div key={index} className='h-[250px] w-full bg-slate-200 animate-pulsse rounded-xl'>

                    </div>
                ))}
            </div>
            </div>
        )
    }

export default MyTrips;
