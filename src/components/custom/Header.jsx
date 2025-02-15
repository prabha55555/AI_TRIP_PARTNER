import { Button } from "@material-tailwind/react";

import React from 'react';



function Header() {
    return (
        <div className="p-3 shadow-sm flex justify-between items-center px-5">
          <img src="/logo.svg" alt="" className="h-9 w-8" />
          <div>
            <Button className="normal-case">Sign in</Button>
          </div>
        </div>
    );
}

export default Header;