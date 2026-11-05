import { Toaster as Sonner } from "sonner";

const Toaster = (props) => (
    <Sonner
        position="top-center"
        richColors
        closeButton
        toastOptions={{ classNames: { toast: "font-sans" } }}
        {...props}
    />
);

export { Toaster };
