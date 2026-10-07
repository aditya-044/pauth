import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldAlert size={32} strokeWidth={1.8} />
                </div>

                <p className="mt-8 text-sm font-semibold tracking-[0.25em] text-primary">
                    ERROR 404
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Page not found
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    The page you're looking for doesn't exist, may have been
                    moved, or the URL might be incorrect.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                        onClick={() => navigate("/")}
                        className="h-11 px-5"
                    >
                        <Home size={18} />
                        Go to home
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="h-11 px-5"
                    >
                        <ArrowLeft size={18} />
                        Go back
                    </Button>
                </div>

                <div className="mx-auto mt-10 flex max-w-sm items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
                    <ShieldAlert size={14} />
                    <span>PAAuth — Secure your accounts, simply.</span>
                </div>
            </div>
        </div>
    );
}