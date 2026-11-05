import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "./Header";
import SiteFooter from "./SiteFooter";

/** App shell: header + routed page + footer. Lives *inside* the router so Header can use <Link>. */
function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="page-in flex-1">
                <Outlet />
            </main>
            <SiteFooter />
            <Toaster />
            <ScrollRestoration />
        </div>
    );
}

export default Layout;
