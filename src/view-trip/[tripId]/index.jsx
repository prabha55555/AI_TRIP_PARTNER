import { doc ,setDoc,getDoc} from "firebase/firestore";
import{db} from "../../AI/firebase";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";


function Viewtrip() {
    const { tripId } = useParams();
    const[trip,setTrip]=useState([]);
    useEffect(()=>{
        tripId && GetTripData();
    },[tripId])

    const GetTripData=async()=>{
        const docRef=doc(db,'AI-Trips',tripId);
        const docSnap=await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document data:",docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No Document found");
            toast("No Trip Found!!!!..")
        }
    }
    
   
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:pd-56 relative'>
<div className="absolute inset-0 w-full min-h-full bg-cover bg-center bg-no-repeat"
     style={{ backgroundImage: "url('/bg.jpg')" }}>
</div>        <div className="relative z-10">
   
   <InfoSection trip={trip} />
   <Hotels trip={trip} />
   <PlacesToVisit trip={trip}/>
   <Footer />
   </div>
    </div>
  )
}
export default Viewtrip;
