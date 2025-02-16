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
        <div className="p-3 shadow-sm flex justify-between items-center px-5">
            <img src="/logo.svg" alt="Logo" className="h-9 w-8" />
            <div>
                {user ? (
                    <div className="flex items-center gap-3">
                        <a href="/create">
                        <Button variant="outlined" className="rounded-full normal-case">New Trip</Button>
                        </a>
                        <a href="/my-trips">
                        <Button variant="outlined" className="rounded-full normal-case">My Trips</Button>
                        </a>
                        <Popover>
                            <PopoverTrigger>
                                <img 
                                    src={user.picture} 
                                    alt="User Avatar" 
                                    className="h-[35px] w-[35px] rounded-full cursor-pointer" 
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <h2 
                                    onClick={() => {
                                        handleLogout();
                                        window.location.href = "/";
                                    }} 
                                    className="cursor-pointer hover:text-red-500"
                                >
                                    Logout
                                </h2>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button onClick={() => setOpenDialog(true)} className="normal-case">Sign in</Button>
                )}
                <Dialog open={openDialog}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogDescription>
                                <img src="/logo.svg" className="h-9 w-8" />
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
    );
}

export default Header;
