import { chatSession } from "@/AI/AIModel.jsx";
import { db } from "@/AI/firebase.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@material-tailwind/react";  
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import GooglePlaceAutocomplete from "react-google-places-autocomplete";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AI_PROMPT, BudgetCategories, SelectTravelList } from "./option.jsx";


const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

function Create() {
    const [place, setPlace] = useState(null);
    const [form, setForm] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const handleInput = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        console.log(form);
    }, [form]);

    const login = useGoogleLogin({
        onSuccess: (tokenInfo) => {
            console.log("Login Success:", tokenInfo);
            GetUserProfile(tokenInfo);
        },
        onError: (error) => {
            console.error("Login Error:", error);
        },
    });

    const onGenerate = async () => {
        const user = localStorage.getItem("user");
    
        if (!user) {
            setOpenDialog(true);
            return;
        }
    
        // Check if any required field is missing
        if (!form?.destination?.label || !form?.DaysCount || !form?.Budget || !form?.PeopleCount) {
            toast("Please fill all required details before generating the trip", { type: "error" });
            return;
        }
    
        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace("{destination}", form?.destination?.label)
            .replace("{DaysCount}", form?.DaysCount)
            .replace("{PeopleCount}", form?.PeopleCount)
            .replace("{Budget}", form?.Budget)
            .replace("{DaysCount}", form?.DaysCount);
    
        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const tripData = await result?.response.text();
            console.log(tripData);
            await saveAITrip(tripData);
            setLoading(false);
        } catch (error) {
            console.error("Error generating trip:", error);
            toast("Error generating trip", { type: "error" });
            setLoading(false);
        }
    };
    

    const saveAITrip = async (tripData) => {
        setLoading(true);

        const docId = Date.now().toString();
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            await setDoc(doc(db, "AI-Trips", docId), {
                userLocation: form,
                tripData: JSON.parse(tripData),
                userEmail: user?.email,
                id: docId,
            });
            setLoading(false);
            navigate(`/view-trip/${docId}`);
            console.log("Trip data saved successfully");
        } catch (error) {
            console.error("Error saving trip data:", error);
            toast("Error saving trip data", { type: "error" });
        }

        
    };

    const GetUserProfile = (tokenInfo) => {
        axios
            .get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenInfo?.access_token}`,
                        Accept: "Application/json",
                    },
                }
            )
            .then((resp) => {
                console.log(resp);
                localStorage.setItem("user", JSON.stringify(resp.data));
                setOpenDialog(false);
                onGenerate();
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);
            });
    };

    return (
        <div className="relative min-h-screen w-full">
            <img src="/bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover z-0 -top-10" />
            <div className="relative z-10">
                <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
                    <h2 className="font-bold text-3xl">
                        🏖️Tell us your travel preferences🏖️🌴
                    </h2>
                    <p className="mt-3 text-yellow-500 text-xl"></p>
                    <p className="mt-3 text-yellow-500 text-xl">
                        Just provide the basic information, and our trip planner will generate
                        a customized itinerary based on your preferences
                    </p>
                    <div className="mt-20 flex flex-col gap-10">
                        <div>
                            <h2 className="text-xl my-3 font-medium">
                                What is your destination of choice ❓
                            </h2>
                            <GooglePlaceAutocomplete
                                apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                                placeholder="Enter a destination"
                                selectProps={{
                                    place,
                                    onChange: (e) => {
                                        setPlace(e);
                                        handleInput("destination", e);
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl my-3 font-medium">
                                How many days are you planning your trip 🎉❓
                            </h2>
                            <input
                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-white bg-white
                                    rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                placeholder="Ex.2"
                                type="number"
                                min="1"
                                max="6"
                                onChange={(e) => {
                                    if (parseInt(e.target.value) > 6) {
                                        toast("Please enter days between 1 to 6", { type: "error" });
                                        e.target.value = 6;
                                    }
                                    handleInput("DaysCount", e.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl my-3 font-medium">
                                What is your Budget 🫰❓
                            </h2>
                            <div className="grid grid-cols-3 gap-5 mt-5">
                                {BudgetCategories.map((item, index) => (
                                    <div
                                        onClick={() => handleInput("Budget", item.mtitle)}
                                        key={index}
                                        className={`p-4 border border-white rounded-lg hover:bg-amber-400 shadow-[0_10px_20px_rgba(0,0,0,0.4)] cursor-pointer
                                             ${
                                                    form?.Budget === item.mtitle && "shadow-xl !border-black bg-amber-400"
                                             }`}
                                    >
                                        <h2 className="font-bold text-lg mt-3">{item.mtitle}</h2>
                                        <h2 className="text-4xl">{item.icon}</h2>
                                        <h2 className="text-sm text-white -500 mt-4">{item.desc}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl my-3 font-medium">
                                Who do you plan on travel on your next adventure 🍁❓
                            </h2>
                            <div className="grid grid-cols-3 gap-5 mt-5">
                                {SelectTravelList.map((item, index) => (
                                    <div
                                        onClick={() => handleInput("PeopleCount", item.people)}
                                        key={index}
                                        className={`p-4 border border-white rounded-lg hover:bg-amber-400 shadow-[0_10px_20px_rgba(0,0,0,0.4)] cursor-pointer
                                        ${
                                             form?.PeopleCount === item.people && "shadow-xl !border-black bg-amber-400"
                                        }`}           
                                    >
                                        <h2 className="text-4xl">{item.icon}</h2>
                                        <h2 className="font-bold text-lg mt-3">{item.mtitle}</h2>
                                        <h2 className="text-sm text-white -500">{item.desc}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="my-10 justify-center flex ">
                        <Button disabled={loading} onClick={onGenerate}>
                            {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : "Make the Trip"}
                        </Button>
                    </div>
                    <Dialog open={openDialog}>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogDescription>
                                    <img src="/logoo.png" className="h-9 w-8" />
                                    <h2 className="font-bold text-lg mt-7 my-3">
                                        Sign In With Google
                                    </h2>
                                    <p> Sign in to the App With authentication security</p>
                                    <Button
                                        onClick={login}
                                        className="w-full mt-5 flex items-center justify-center space-x-2 text-md normal-case"
                                    >
                                        <FcGoogle size={20} />
                                        <span>Sign In with Google</span>
                                    </Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Create;
