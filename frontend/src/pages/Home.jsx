import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    QrCode,
    RefreshCw,
    Lock,
    Key,
    Download,
    ArrowRight,
    LogIn
} from "lucide-react";

export function Home() {
    const navigate = useNavigate();

    return (
        <div>

            <div className="flex flex-col gap-8 py-5 sm:py-7 lg:py-9">

                <div className="mx-auto max-w-4xl text-center">

                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm sm:h-14 sm:w-14">
                        <ShieldCheck size={32} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                        Secure your accounts,
                        <span className="block text-primary">
                            simply.
                        </span>
                    </h1>

                    <p className="mt-4 text-base text-muted-foreground sm:text-lg lg:text-xl">
                        PAuth is a secure authenticator for managing your two-factor authentication codes.
                        Keep your accounts protected with time-based one-time passwords.
                    </p>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-center">

                        <Button
                            onClick={() => navigate("/register")}
                            className="h-11 px-7 text-base sm:h-12 sm:px-8 sm:text-base"
                        >
                            Get started
                            <ArrowRight size={20} />
                        </Button>

                        <Button
                            onClick={() => navigate("/login")}
                            variant="outline"
                            className="h-11 px-7 text-base sm:h-12 sm:px-8 sm:text-base"
                        >
                            <LogIn size={20} />
                            Sign in
                        </Button>

                    </div>

                </div>

                <div className="mx-auto max-w-6xl">

                    <div className="mb-5 text-center">

                        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            Everything you need for secure authentication
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Manage all your TOTP accounts from one secure place.
                        </p>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ShieldCheck size={22} />
                            </div>

                            <h3 className="mt-3 text-base font-semibold text-foreground">
                                Secure TOTP Codes
                            </h3>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Generate time-based one-time passwords for all your accounts with automatic refresh.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <QrCode size={22} />
                            </div>

                            <h3 className="mt-3 text-base font-semibold text-foreground">
                                Easy QR Setup
                            </h3>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Scan QR codes to quickly add new authenticator accounts from supported services.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <RefreshCw size={22} />
                            </div>

                            <h3 className="mt-3 text-base font-semibold text-foreground">
                                Auto-Refresh
                            </h3>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Codes automatically refresh with countdown timers so you always have the latest codes.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Key size={22} />
                            </div>

                            <h3 className="mt-3 text-base font-semibold text-foreground">
                                Recovery Codes
                            </h3>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Generate secure recovery codes to access your accounts if you lose your device.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Download size={22} />
                            </div>

                            <h3 className="mt-3 text-base font-semibold text-foreground">
                                Encrypted Backup
                            </h3>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Export and import your accounts with encrypted backup files for safe storage.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Lock size={22} />
                            </div>

                            <h3 className="mt-3 text-base font-semibold text-foreground">
                                Account Management
                            </h3>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Add, edit, and delete multiple authenticator accounts from a single dashboard.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="mx-auto max-w-4xl">

                    <div className="mb-5 text-center">

                        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            Built with security in mind
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Your authentication data is protected with industry-standard security practices.
                        </p>

                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:border-r lg:border-border lg:pr-6">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Lock size={20} />
                                </div>

                                <h3 className="mt-2 text-base font-semibold text-foreground">
                                    Password Hashing
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your account password is securely hashed before storage, protecting your credentials.
                                </p>

                            </div>

                            <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:border-r lg:border-border lg:pr-6">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck size={20} />
                                </div>

                                <h3 className="mt-2 text-base font-semibold text-foreground">
                                    JWT Authentication
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Secure JSON Web Token authentication for session management and API access.
                                </p>

                            </div>

                            <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:border-r lg:border-border lg:pr-6">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Key size={20} />
                                </div>

                                <h3 className="mt-2 text-base font-semibold text-foreground">
                                    Encrypted Secrets
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    TOTP secrets are encrypted in storage to protect your authentication data.
                                </p>

                            </div>

                            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck size={20} />
                                </div>

                                <h3 className="mt-2 text-base font-semibold text-foreground">
                                    Protected Ownership
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Each account is protected with ownership verification to prevent unauthorized access.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">

                    <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        Ready to secure your accounts?
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                        Create your free PAuth account and start managing your authentication codes today.
                    </p>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-center">

                        <Button
                            onClick={() => navigate("/register")}
                            className="h-11 px-7 text-base sm:h-12 sm:px-8 sm:text-base"
                        >
                            Get started
                            <ArrowRight size={20} />
                        </Button>

                        <Button
                            onClick={() => navigate("/login")}
                            variant="outline"
                            className="h-11 px-7 text-base sm:h-12 sm:px-8 sm:text-base"
                        >
                            <LogIn size={20} />
                            Sign in
                        </Button>

                    </div>

                </div>

                <footer className="mx-auto max-w-4xl border-t border-border pt-6 text-center">

                    <div className="flex items-center justify-center gap-2">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <ShieldCheck size={20} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-foreground">
                            PAuth
                        </span>

                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                        Secure your accounts, simply.
                    </p>

                    <p className="mt-1.5 text-xs text-muted-foreground">
                        © {new Date().getFullYear()} PAuth. All rights reserved.
                    </p>

                </footer>

            </div>

        </div>
    );
}