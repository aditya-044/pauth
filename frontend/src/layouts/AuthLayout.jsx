import { ShieldCheck, ShieldLock } from "lucide-react";

export function AuthLayout({ children }) {

    return (
        <div className="relative flex min-h-dvh items-center justify-center overflow-x-hidden bg-background px-4 py-8 sm:px-6">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            </div>

            <div className="relative mx-auto w-full max-w-md">

                <div className="mb-3 flex flex-col items-center">

                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <ShieldCheck size={30} />
                    </div>

                    <div className="text-xl font-bold tracking-tight text-foreground">
                        PAuth
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                        Secure your accounts, simply.
                    </div>

                </div>

                {children}

                <div className="mt-5 flex justify-center gap-1 text-center text-xs text-muted-foreground">
                    <ShieldLock size={16} />
                    <span>
                        Your account is protected with secure authentication.
                    </span>
                </div>

            </div>

        </div>
    );
}