import React from 'react';
import { Button } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

function Hero() {
    return (
       <div className='flex flex-col items-center mx-56 gap-9'>
        <h1 className='font-extrabold text-[50px] text-center mt-16'> Lets makes the Journey Memorable and Worthable </h1>
       
        <p className='text-xl text-gray-500 text-center'>You enjoy   and explore the overall place of the world with great Memorable </p>
       <Link to={'/create'}>
       <Button className='normal-case'> Get   Started,It's</Button>
       </Link>
       </div>
    )
}

export default Hero;
