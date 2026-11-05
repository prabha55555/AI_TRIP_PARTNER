import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

function RouteError({ notFound = false }) {
    return (
        <EmptyState
            className="min-h-[60vh] justify-center"
            icon={Compass}
            title={notFound ? "Page not found" : "Something went wrong"}
            description={notFound ? "That page doesn't exist." : "An unexpected error occurred. Please try again."}
        >
            <Button asChild>
                <Link to="/">Back to home</Link>
            </Button>
        </EmptyState>
    );
}

export default RouteError;
