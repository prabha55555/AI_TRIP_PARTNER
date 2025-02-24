import React from 'react';
import { Button } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            {/* Background Image */}
            <img 
                src="/ship.jpg" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            
            {/* Content */}
            <div className="relative flex flex-col items-center px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-48 gap-6 md:gap-9 z-10 text-center">
                <h1 className="font-extrabold text-4xl sm:text-5xl md:text-5xl lg:text-4xl xl:text-6xl leading-tight text-white">
                    Let's make the Journey Memorable and Worthwhile
                </h1>
                
                <Link to={'/create'}>
                    <Button className="normal-case mt-6 sm:mt-10 md:mt-14 lg:mt-16 xl:mt-20 cursor-pointer hover:bg-orange-700 transform transition duration-300">
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Hero;
