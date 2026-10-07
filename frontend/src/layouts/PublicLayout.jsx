import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export function PublicLayout() {
    return (
        <div className="min-h-dvh bg-background px-4 py-3 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="fixed -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

                <div className="fixed -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            </div>
            <div className="mx-auto w-full max-w-7xl">
                <div className="overflow-visible rounded-3xl border border-border bg-card shadow-sm">
                    <Navbar />

                    <main className="px-5 py-2 sm:py-3 lg:px-10 lg:py-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
