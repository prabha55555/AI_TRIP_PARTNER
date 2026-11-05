import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/custom/Home.jsx";
import Layout from "./components/custom/Layout.jsx";
import RouteError from "./components/custom/RouteError.jsx";
import { AuthProvider } from "./lib/auth.jsx";
import "./index.css";

// Route-level code splitting: each page is its own chunk, loaded on demand.
const Create = lazy(() => import("./create/index.jsx"));
const MyTrips = lazy(() => import("./my-trips/index.jsx"));
const ViewTrip = lazy(() => import("./view-trip/[tripId]/index.jsx"));

const page = (el) => (
    <Suspense fallback={<div className="grid min-h-[60vh] place-items-center text-muted-foreground">Loading…</div>}>
        {el}
    </Suspense>
);

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <RouteError />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/create", element: page(<Create />) },
            { path: "/my-trips", element: page(<MyTrips />) },
            { path: "/view-trip/:tripId", element: page(<ViewTrip />) },
            { path: "*", element: <RouteError notFound /> },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            {/* AuthProvider is above the router so every route shares one session. */}
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);
