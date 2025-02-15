import { chatSession } from '@/AI/AIModel.jsx';
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import GooglePlaceAutocomplete from 'react-google-places-autocomplete';
import { toast } from "sonner";
import { AI_PROMPT, BudgetCategories, SelectTravelList } from './option.jsx';

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

function Create() { 
    const [place, setPlace] = useState(null);
    const [form, setForm] = useState({});
    
    const handleInput = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {   
        console.log(form); 
    }, [form]);

    const onGenerate = async() => {
        if (form?.DaysCount > 5 && (!form?.Budget || !form?.PeopleCount || !form?.destination)) {
            toast("Please fill all the fields", { type: "error" });
            return;
        }
        const FINAL_PROMPT = AI_PROMPT
        .replace('{destination}', form?.destination?.label)
        .replace('{DaysCount}', form?.DaysCount)
        .replace('{PeopleCount}', form?.PeopleCount)
        .replace('{Budget}', form?.Budget)
        .replace('{DaysCount}', form?.DaysCount);

        console.log(FINAL_PROMPT);

        const result = await chatSession.sendMessage(FINAL_PROMPT);

        console.log(result?.response.text());
    }

    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h2 className="font-bold text-3xl">🏖️Tell us your travel preferences🏖️🌴</h2>
            <p className='mt-3 text-yellow-500 text-xl'></p>
            <p className='mt-3 text-yellow-500 text-xl'>
                Just provide the basic information, and our trip planner will generate a customized itinerary based on your preferences
            </p>
            <div className='mt-20 flex flex-col gap-10'>
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is your destination of choice ❓</h2>
                    <GooglePlaceAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                        placeholder="Enter a destination" 
                        selectProps={{
                            place,
                            onChange: (e) => { setPlace(e); handleInput('destination', e); }
                        }}
                    />
                </div>
                <div>
                    <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip 🎉❓</h2>
                    <input 
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-white 
                        rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Ex.2" 
                        type='number' 
                        min='1' 
                        onChange={(e) => handleInput("DaysCount", e.target.value)}
                    />
                </div>
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is your Budget 🫰❓</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'> 
                        {BudgetCategories.map((item, index) => (
                            <div
                                onClick={() => handleInput("Budget", item.mtitle)}
                                key={index}
                                className={`p-4 border border-white rounded-lg hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] cursor-pointer
                                    ${form?.Budget === item.mtitle && 'shadow-xl !border-black'}`}
                            >
                                <h2 className="font-bold text-lg mt-3">{item.mtitle}</h2>
                                <h2 className="text-4xl">{item.icon}</h2>
                                <h2 className="text-sm text-yellow-500">{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className='text-xl my-3 font-medium'>Who do you plan on travel on your next adventure 🍁❓</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'> 
                        {SelectTravelList.map((item, index) => (
                            <div
                                onClick={() => handleInput("PeopleCount", item.people)}
                                key={index}
                                className={`p-4 border border-white rounded-lg hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] cursor-pointer
                                    ${form?.PeopleCount === item.people && 'shadow-xl !border-black'}`}
                            >
                                <h2 className="text-4xl">{item.icon}</h2>
                                <h2 className="font-bold text-lg mt-3">{item.mtitle}</h2>
                                <h2 className="text-sm text-yellow-500">{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='my-10 justify-center flex'>
                <Button onClick={onGenerate}>Make the Trip</Button>
            </div>
        </div>
    );
}

export default Create;
