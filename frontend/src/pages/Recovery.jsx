import { FieldError } from "@/components/FieldError";
import { Message } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyRecoveryCode } from "@/services/accountService";
import { verifyRecoveryCodeSchema } from "@/validations/accountsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export function Recovery() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(verifyRecoveryCodeSchema),
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    async function handleRecovery(data) {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await verifyRecoveryCode(
                id,
                data.code
            );

            setSuccess(
                `${response.message} ${response.remainingCodes} recovery codes remaining.`
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to verify recovery code."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-6 py-2 sm:py-3 lg:py-4">

                <div className="max-w-3xl">

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/accounts")}
                        className="mb-4 h-11 px-4 text-sm text-muted-foreground hover:bg-muted/50"
                    >
                        <ArrowLeft size={17} />
                        Back to accounts
                    </Button>

                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
                        Account recovery
                    </p>

                    <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                        Use a recovery code.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Enter one of your unused recovery codes to verify access to this account.
                    </p>

                </div>
            </div>

            <div className="mx-auto mt-2 max-w-md">

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck size={22} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                        Verify recovery code
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Recovery codes can only be used once. Enter an unused
                        code exactly as it was provided.
                    </p>

                    {(error || success) && (
                        <div className="mt-5">
                            {error && (
                                <Message type="error">
                                    {error}
                                </Message>
                            )}

                            {success && (
                                <Message type="success">
                                    {success}
                                </Message>
                            )}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(handleRecovery)}
                        className="mt-5 space-y-4"
                    >
                        <div className="space-y-2">

                            <Label htmlFor="code">
                                Recovery code
                            </Label>

                            <Input
                                id="code"
                                placeholder="XXXXXXXX"
                                autoComplete="off"
                                aria-invalid={!!errors.code}
                                aria-describedby={
                                    errors.code
                                        ? "code-error"
                                        : undefined
                                }
                                className="font-mono tracking-[0.2em] uppercase"
                                {...register("code")}
                            />

                            {errors.code && (
                                <FieldError
                                    id="code-error"
                                    message={errors.code.message}
                                />
                            )}

                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full px-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                    Verifying...
                                </span>
                            ) : (
                                "Verify recovery code"
                            )}
                        </Button>
                    </form>

                </div>
            </div>
        </div>
    );
}