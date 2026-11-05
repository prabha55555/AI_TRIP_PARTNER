import { Loader2, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Logo from "./Logo";

function LoginDialog({ open, onOpenChange, onSignIn, loading }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-3xl bg-white p-8">
                <DialogHeader className="items-center text-center sm:text-center">
                    <Logo className="mb-2 h-12 w-12" />
                    <DialogTitle className="text-2xl font-bold">Sign in to TravelBeam</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Save your itineraries and open them from any device.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="outline" size="lg" className="w-full" onClick={onSignIn} disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FcGoogle size={20} />}
                    Continue with Google
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" /> We only read your name, email and photo.
                </p>
            </DialogContent>
        </Dialog>
    );
}

export default LoginDialog;
