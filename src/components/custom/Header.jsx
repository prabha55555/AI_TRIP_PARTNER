import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@material-tailwind/react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

function Header() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleLogout = () => {
        googleLogout();
        localStorage.clear();
        window.location.reload();
    };

    const login = useGoogleLogin({
        onSuccess: (tokenInfo) => {
            console.log("Login Success:", tokenInfo);
            GetUserProfile(tokenInfo);
        },
        onError: (error) => {
            console.error("Login Error:", error);
        },
    });

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
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error fetching user profile:", error);
            });
    };

    return (
        <div className="p-3 shadow-sm flex justify-between items-center px-5 bg-[rgb(0,137,132)] text-white">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3">
    <img src="/logoo.png" alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12" />
    <h1
        className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide 
                   text-transparent bg-gradient-to-r from-black via-purplet-500 to-rose-500 bg-clip-text"
        style={{ fontFamily: "Montserrat, sans-serif" }}
    >
        TravelBeam
    </h1>
</div>


            {/* Navigation & User Profile */}
            <div className="flex items-center gap-3">
                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Buttons Hidden on Small Screens */}
                        <a href="/create" >
                            <Button variant="outlined" className="rounded-full px-4 py-2 text-sm sm:text-base hover:bg-amber-400">
                                New Trip
                            </Button>
                        </a>
                        <a href="/my-trips" >
                            <Button variant="outlined" className="rounded-full px-4 py-2 text-sm sm:text-base hover:bg-amber-400">
                                My Trips
                            </Button>
                        </a>

                        {/* User Profile Popover */}
                        <Popover>
                            <PopoverTrigger>
                                <img 
                                    src={user.picture} 
                                    alt="User Avatar" 
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer border-2 border-white" 
                                />
                            </PopoverTrigger>
                            <PopoverContent className="bg-white p-2 rounded-2xl shadow-md w-30">
                                <h2 
                                    onClick={() => {
                                        handleLogout();
                                        window.location.href = "/";
                                    }} 
                                    className="cursor-pointer hover:text-red-500 text-center font-semibold" 
                                >
                                    Logout
                                </h2>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button 
                        onClick={() => setOpenDialog(true)} 
                        className="px-4 py-2 text-sm sm:text-base normal-case"
                    >
                        Sign in
                    </Button>
                )}
            </div>

            {/* Google Login Dialog */}
            <Dialog open={openDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogDescription>
                            <div className="flex flex-col items-center">
                                <img src="/logoo.png" className="h-8 w-8 sm:h-9 sm:w-9" />
                                <h2 className="font-bold text-lg mt-5 my-2">
                                    Sign In With Google
                                </h2>
                                <p className="text-gray-600 text-sm text-center">
                                    Securely sign in to access your trips.
                                </p>
                                <Button
                                    onClick={login}
                                    className="w-full mt-5 flex items-center justify-center space-x-2 text-md normal-case bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <FcGoogle size={20} />
                                    <span>Sign In with Google</span>
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Header;
