import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyOtp } from "@/services/accountService";
import { verifyOTPSchema } from "@/validations/accountsValidation";
import { X } from "lucide-react";
import { useState } from "react";

export function VerifyOtpDialog({
    account,
    onClose
}) {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function handleVerify(event) {
        event.preventDefault();

        setError("");
        setResult(null);

        const cleanToken = token.trim();

        const validation = verifyOTPSchema.safeParse({
            token: cleanToken
        });

        if (!validation.success) {
            setError(
                validation.error.issues[0]?.message ||
                "Invalid OTP."
            );

            return;
        }

        try {
            setLoading(true);

            const response = await verifyOtp(
                account.id,
                cleanToken
            );

            if (response.valid) {
                setResult(response);
                setError("");
            } else {
                setError("Invalid or expired OTP.");
                setResult(null);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to verify this code."
            );
            setResult(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 dark:bg-black/60"
        >

            <div className="flex min-h-full items-center justify-center">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl"
                >

                    <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                            <h2 className="text-base font-semibold text-foreground">
                                Verify code
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Check a one-time password for{" "}
                                {account.serviceName}.
                            </p>

                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="shrink-0 hover:bg-primary/10 hover:text-primary"
                            aria-label="Close verification dialog"
                        >
                            <X size={18} />
                        </Button>

                    </div>

                    <form
                        onSubmit={handleVerify}
                        className="mt-4 space-y-4"
                    >

                        <div className="space-y-2">

                            <Label htmlFor="otp-token">
                                OTP code
                            </Label>

                            <Input
                                id="otp-token"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="123456"
                                maxLength={account.digits || 6}
                                value={token}
                                onChange={(event) => {
                                    const value =
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        );

                                    setToken(value);
                                    setResult(null);
                                    setError("");
                                }}
                            />

                        </div>

                        {error && (
                            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                                OTP verified successfully.
                            </div>
                        )}

                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:w-auto"
                            >
                                Close
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    loading ||
                                    !token.trim()
                                }
                                className="w-full sm:w-auto"
                            >
                                {loading
                                    ? "Checking..."
                                    : "Verify"}
                            </Button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}