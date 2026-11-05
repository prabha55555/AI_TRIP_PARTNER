import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import LoginDialog from "@/components/custom/LoginDialog";
import { isValidProfile, parseStoredProfile } from "./profile";

const STORAGE_KEY = "user";
const AuthContext = createContext(null);

function readStoredUser() {
    // Bad or legacy data is treated as "signed out" rather than showing a broken account.
    return parseStoredProfile(localStorage.getItem(STORAGE_KEY));
}

/**
 * Single source of truth for the signed-in user. Replaces the duplicated
 * login code that used to live in Header and Create, and removes the
 * window.location.reload() calls: state changes re-render the tree instead.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [loginOpen, setLoginOpen] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const afterLogin = useRef(null);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenInfo) => {
            try {
                // Token goes in the Authorization header, not the URL (URLs end up in logs/history).
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
                });
                if (!res.ok) throw new Error(`userinfo ${res.status}`);
                const { name, email, picture } = await res.json();
                const profile = { name, email, picture };
                if (!isValidProfile(profile)) throw new Error("Google profile had no email");
                localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
                setUser(profile);
                setLoginOpen(false);
                toast.success(`Welcome, ${name?.split(" ")[0] ?? "traveler"}!`);
                const next = afterLogin.current;
                afterLogin.current = null;
                next?.(profile);
            } catch (err) {
                console.error("Failed to load Google profile", err);
                toast.error("Sign-in failed. Please try again.");
            } finally {
                setSigningIn(false);
            }
        },
        onError: () => {
            setSigningIn(false);
            toast.error("Google sign-in was cancelled or failed.");
        },
    });

    /** Open the login dialog; `callback(profile)` runs once sign-in succeeds. */
    const requestLogin = useCallback((callback) => {
        afterLogin.current = callback ?? null;
        setLoginOpen(true);
    }, []);

    const signOut = useCallback(() => {
        googleLogout();
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, requestLogin, signOut }),
        [user, requestLogin, signOut]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
            <LoginDialog
                open={loginOpen}
                onOpenChange={setLoginOpen}
                loading={signingIn}
                onSignIn={() => {
                    setSigningIn(true);
                    googleLogin();
                }}
            />
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
