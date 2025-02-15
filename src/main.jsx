import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Create from './create/index.jsx'
import Header from "./components/custom/Header.jsx";
import { Toaster } from "@/components/ui/sonner"



const router = createBrowserRouter([
   { path:'/',element:<App/>},
   {path:'/create',element:<Create/>}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
      <Toaster />
    <RouterProvider router={router}/>
  </StrictMode>,
)   
