import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Header from './components/custom/header'; // Import the Header component
import Create from './create/index.jsx';
import './index.css';
import MyTrips from './my-trips/index.jsx';
import Viewtrip from './view-trip/[tripId]/index.jsx';

const router = createBrowserRouter([
   { path:'/', element: <App /> },
   { path:'/create', element: <Create /> },
   { path:'/view-trip/:tripId', element: <Viewtrip /> },
   { path:'/my-trips', element: <MyTrips /> }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <Header /> 
            <Toaster />
            <RouterProvider router={router}/>
        </GoogleOAuthProvider>
    </StrictMode>,
)
