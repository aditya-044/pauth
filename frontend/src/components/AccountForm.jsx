import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FieldError } from "./FieldError";
import { Message } from "./Message";
import { AsyncState } from "./AsyncState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    addAccountSchema,
    updateAccountSchema
} from "../validations/accountsValidation";
import { useEffect, useState } from "react";
import {
    addAccount,
    getAccountById,
    updateAccount
} from "../services/accountService";
import { AccountSetupResult } from "./AccountSetupResult";

export function AccountForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [pageError, setPageError] = useState("");
    const [operationError, setOperationError] = useState("");
    const [success, setSuccess] = useState("");
    const [createdAccount, setCreatedAccount] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(
            isEditMode
                ? updateAccountSchema
                : addAccountSchema
        ),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            serviceName: "",
            issuer: "",
            account: "",
            secret: undefined,
            algorithm: "SHA1",
            digits: 6,
            period: 30
        }
    });

    const errorInputClass =
        "border-red-400/70 bg-red-50/30 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-500/40 dark:bg-red-950/10 dark:focus-visible:border-red-400";

    async function loadAccount() {
        if (!isEditMode) return;

        try {
            setPageLoading(true);
            setPageError("");

            const response = await getAccountById(id);

            reset({
                serviceName:
                    response.account.serviceName?.replace(
                        /\b[a-z]/g,
                        (ch) => ch.toUpperCase()
                    ) || "",
                issuer:
                    response.account.issuer?.replace(
                        /\b[a-z]/g,
                        (ch) => ch.toUpperCase()
                    ) || "",
                account:
                    response.account.account || "",
                secret: "",
                algorithm:
                    response.account.algorithm || "SHA1",
                digits:
                    response.account.digits || 6,
                period:
                    response.account.period || 30
            });
        } catch (err) {
            setPageError(
                err.response?.data?.message ||
                "Unable to load account."
            );
        } finally {
            setPageLoading(false);
        }
    }

    useEffect(() => {
        loadAccount();
    }, [id, isEditMode]);

    async function handleSubmitForm(data) {
        try {
            setLoading(true);
            setOperationError("");
            setSuccess("");

            const issuer =
                data.issuer?.trim() ||
                data.serviceName;

            if (isEditMode) {
                await updateAccount(id, {
                    serviceName: data.serviceName,
                    issuer,
                    account: data.account
                });

                setSuccess(
                    "Account updated successfully."
                );

                setTimeout(() => {
                    navigate("/accounts");
                }, 1500);
            } else {
                const response = await addAccount({
                    ...data,
                    issuer
                });

                setCreatedAccount(
                    response.account || response
                );
            }
        } catch (err) {
            setOperationError(
                err.response?.data?.message ||
                (
                    isEditMode
                        ? "Unable to update account."
                        : "Unable to create account."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    if (createdAccount) {
        return (
            <AccountSetupResult
                account={createdAccount}
            />
        );
    }

    if (pageLoading || pageError) {
        return (
            <AsyncState
                loading={pageLoading}
                error={pageError}
                loadingMsg="Loading account..."
                onRefresh={loadAccount}
            />
        );
    }

    return (
        <div className="flex flex-col gap-2 py-2">

            <div className="max-w-3xl">

                <Button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    variant="ghost"
                    className="mb-4 h-10 px-3 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                    <ArrowLeft size={17} />
                    Back to accounts
                </Button>

                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
                    {isEditMode
                        ? "Update your authenticator"
                        : "Add a new authenticator"}
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    {isEditMode
                        ? "Update account"
                        : "Add account"}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {isEditMode
                        ? "Update your authentication account details."
                        : "Add an account to generate two-factor authentication codes."}
                </p>

            </div>

            {success && (
                <Message type="success">
                    {success}
                </Message>
            )}

            {operationError && (
                <Message type="error">
                    {operationError}
                </Message>
            )}

            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >

                <div className="space-y-5">

                    <div className="space-y-2">

                        <Label htmlFor="serviceName">
                            Service name
                        </Label>

                        <Input
                            id="serviceName"
                            type="text"
                            placeholder="Google"
                            disabled={loading}
                            aria-invalid={!!errors.serviceName}
                            aria-describedby={
                                errors.serviceName
                                    ? "serviceName-error"
                                    : undefined
                            }
                            className={
                                errors.serviceName
                                    ? errorInputClass
                                    : ""
                            }
                            {...register("serviceName")}
                        />

                        {errors.serviceName && (
                            <FieldError
                                id="serviceName-error"
                                message={
                                    errors.serviceName.message
                                }
                            />
                        )}

                    </div>

                    <div className="space-y-2">

                        <Label htmlFor="issuer">
                            Issuer
                        </Label>

                        <Input
                            id="issuer"
                            type="text"
                            placeholder="Google"
                            disabled={loading}
                            aria-invalid={!!errors.issuer}
                            aria-describedby={
                                errors.issuer
                                    ? "issuer-error"
                                    : undefined
                            }
                            className={
                                errors.issuer
                                    ? errorInputClass
                                    : ""
                            }
                            {...register("issuer")}
                        />

                        {errors.issuer && (
                            <FieldError
                                id="issuer-error"
                                message={
                                    errors.issuer.message
                                }
                            />
                        )}

                    </div>

                    <div className="space-y-2">

                        <Label htmlFor="account">
                            Account
                        </Label>

                        <Input
                            id="account"
                            type="text"
                            placeholder="you@example.com"
                            disabled={loading}
                            aria-invalid={!!errors.account}
                            aria-describedby={
                                errors.account
                                    ? "account-error"
                                    : undefined
                            }
                            className={
                                errors.account
                                    ? errorInputClass
                                    : ""
                            }
                            {...register("account")}
                        />

                        {errors.account && (
                            <FieldError
                                id="account-error"
                                message={
                                    errors.account.message
                                }
                            />
                        )}

                    </div>

                    <div className="space-y-2">

                        <Label htmlFor="secret">
                            Secret key
                        </Label>

                        <Input
                            id="secret"
                            type="password"
                            disabled={isEditMode || loading}
                            placeholder={
                                isEditMode
                                    ? "Cannot be changed"
                                    : "Leave blank to generate a secret"
                            }
                            aria-invalid={!!errors.secret}
                            aria-describedby={
                                errors.secret
                                    ? "secret-error"
                                    : undefined
                            }
                            className={
                                errors.secret
                                    ? errorInputClass
                                    : ""
                            }
                            {...register("secret")}
                        />
                        {errors.secret ? (
                            <FieldError
                                id="secret-error"
                                message={errors.secret.message}
                            />
                        ) : (<p className="text-xs leading-5 text-muted-foreground">
                                {isEditMode
                                    ? "The secret key cannot be changed after the account is created."
                                    : "Paste a Base32 secret from your provider, or leave blank to generate one."}
                            </p>
                        )}

                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">

                        <div className="space-y-2">

                            <Label htmlFor="algorithm">
                                Algorithm
                            </Label>

                            <select
                                id="algorithm"
                                disabled={
                                    isEditMode || loading
                                }
                                {...register("algorithm")}
                                className="h-10 w-full rounded-md border border-border bg-background px-2 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                            >
                                <option value="SHA1">
                                    SHA1
                                </option>

                                <option value="SHA256">
                                    SHA256
                                </option>

                                <option value="SHA512">
                                    SHA512
                                </option>
                            </select>

                            {errors.algorithm && (
                                <FieldError
                                    id="algorithm-error"
                                    message={
                                        errors.algorithm.message
                                    }
                                />
                            )}

                        </div>

                        <div className="space-y-2">

                            <Label htmlFor="digits">
                                Digits
                            </Label>

                            <select
                                id="digits"
                                disabled={
                                    isEditMode || loading
                                }
                                {...register("digits", {
                                    valueAsNumber: true
                                })}
                                className="h-10 w-full rounded-md border border-border bg-background px-2 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                            >
                                <option value={6}>
                                    6
                                </option>

                                <option value={8}>
                                    8
                                </option>
                            </select>

                            {errors.digits && (
                                <FieldError
                                    id="digits-error"
                                    message={
                                        errors.digits.message
                                    }
                                />
                            )}

                        </div>

                        <div className="space-y-2">

                            <Label htmlFor="period">
                                Period
                            </Label>

                            <select
                                id="period"
                                disabled={
                                    isEditMode || loading
                                }
                                {...register("period", {
                                    valueAsNumber: true
                                })}
                                className="h-10 w-full rounded-md border border-border bg-background px-2 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                            >
                                <option value={30}>
                                    30 seconds
                                </option>

                                <option value={60}>
                                    60 seconds
                                </option>
                            </select>

                            {errors.period && (
                                <FieldError
                                    id="period-error"
                                    message={
                                        errors.period.message
                                    }
                                />
                            )}

                        </div>

                    </div>

                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">

                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full px-4 sm:w-auto"
                        onClick={() =>
                            navigate("/accounts")
                        }
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        className="h-10 w-full px-5 sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />

                                {isEditMode
                                    ? "Updating account..."
                                    : "Adding account..."}
                            </span>
                        ) : (
                            <>
                                {isEditMode ? (
                                    "Update account"
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Add account
                                    </>
                                )}
                            </>
                        )}
                    </Button>

                </div>

            </form>

        </div>
    );
}