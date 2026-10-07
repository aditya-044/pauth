import { Button } from "./ui/button";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AccountSetupResult({ account }) {
    const navigate = useNavigate();

    const [copied, setCopied] = useState(false);

    async function copyRecoveryCodes() {
        try {
            await navigator.clipboard.writeText(
                (account.recoveryCodes || []).join("\n")
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.log(
                "Failed to copy recovery codes:",
                err
            );
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-8 py-2 sm:py-4 lg:py-6">

                <div className="max-w-3xl">

                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
                        Account created
                    </p>

                    <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Save your setup details.
                    </h1>

                    <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                        Your account is ready. Save your recovery codes somewhere secure before continuing.
                    </p>

                </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck size={22} />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        QR code
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Scan this QR code with another authenticator app to set up {account.serviceName}.
                    </p>

                    {account.qrCode ? (
                        <div className="mt-6 flex justify-center">
                            <div className="rounded-xl border border-border bg-white p-3">
                                <img
                                    src={account.qrCode}
                                    alt="Account QR code"
                                    className="h-52 w-52 rounded-lg"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                QR code is unavailable for this account.
                            </p>
                        </div>
                    )}

                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

                    <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                            <h2 className="text-xl font-semibold text-foreground">
                                Recovery codes
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Use these if you lose access to your authenticator. Each code can only be used once.
                            </p>

                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={copyRecoveryCodes}
                            className="shrink-0"
                        >
                            {copied ? (
                                <Check size={16} />
                            ) : (
                                <Copy size={16} />
                            )}

                            {copied
                                ? "Copied"
                                : "Copy"}
                        </Button>

                    </div>

                    <ul className="mt-6 grid grid-cols-2 gap-2">
                        {(account.recoveryCodes || []).map(
                            (code) => (
                                <li
                                    key={code}
                                    className="rounded-lg border border-border bg-muted px-3 py-2 text-center font-mono text-sm font-medium tracking-wider text-foreground"
                                >
                                    {code}
                                </li>
                            )
                        )}
                    </ul>

                    <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-sm leading-6 text-muted-foreground">
                            These recovery codes are shown only once. Store them somewhere safe before leaving this page.
                        </p>
                    </div>

                </div>

            </div>

            <div className="mt-6 flex justify-end">

                <Button
                    className="h-14 px-5"
                    onClick={() =>
                        navigate("/accounts")
                    }
                >
                    Continue to accounts
                </Button>

            </div>

        </div>
    );
}