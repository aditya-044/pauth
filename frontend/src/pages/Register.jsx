import { FieldError } from "@/components/FieldError";
import { Message } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/layouts/AuthLayout";
import { registerUser } from "@/services/authService";
import { saveToken } from "@/utils/auth";
import { registerSchema } from "@/validations/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const errorInputClass =
        "border-red-400/70 bg-red-50/30 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-500/40 dark:bg-red-950/10";

    async function handleRegister(data) {
        const {
            username,
            email,
            password
        } = data;

        try {
            setLoading(true);
            setError("");

            const response = await registerUser({
                username,
                email,
                password
            });

            saveToken(response.token);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create account!"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

                <div className="mb-6 text-center">

                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Get started
                    </p>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Create your PAuth account to get started.
                    </p>

                </div>

                {error && (
                    <div className="mb-5">
                        <Message type="error">
                            {error}
                        </Message>
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(handleRegister)}
                >

                    <div className="space-y-2">

                        <Label htmlFor="username">
                            Username
                        </Label>

                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            aria-invalid={!!errors.username}
                            aria-describedby={
                                errors.username
                                    ? "username-error"
                                    : undefined
                            }
                            className={
                                errors.username
                                    ? errorInputClass
                                    : ""
                            }
                            disabled={loading}
                            {...register("username")}
                        />

                        {errors.username && (
                            <FieldError
                                id="username-error"
                                message={errors.username.message}
                            />
                        )}

                    </div>

                    <div className="space-y-2">

                        <Label htmlFor="email">
                            Email
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            aria-invalid={!!errors.email}
                            aria-describedby={
                                errors.email
                                    ? "email-error"
                                    : undefined
                            }
                            className={
                                errors.email
                                    ? errorInputClass
                                    : ""
                            }
                            disabled={loading}
                            {...register("email")}
                        />

                        {errors.email && (
                            <FieldError
                                id="email-error"
                                message={errors.email.message}
                            />
                        )}

                    </div>

                    <div className="space-y-2">

                        <Label htmlFor="password">
                            Password
                        </Label>

                        <div className="relative">

                            <Input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Create a strong password"
                                aria-invalid={!!errors.password}
                                aria-describedby={
                                    errors.password
                                        ? "password-error"
                                        : undefined
                                }
                                className={`pr-10 ${
                                    errors.password
                                        ? errorInputClass
                                        : ""
                                }`}
                                disabled={loading}
                                {...register("password")}
                            />

                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.password ? (
                            <FieldError
                                id="password-error"
                                message={errors.password.message}
                            />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                6+ characters, uppercase, lowercase, and a number required.
                            </p>
                        )}

                    </div>

                    <div className="space-y-2">

                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <div className="relative">

                            <Input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby={
                                    errors.confirmPassword
                                        ? "confirmPassword-error"
                                        : undefined
                                }
                                className={`pr-10 ${
                                    errors.confirmPassword
                                        ? errorInputClass
                                        : ""
                                }`}
                                disabled={loading}
                                {...register("confirmPassword")}
                            />

                            <button
                                type="button"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.confirmPassword && (
                            <FieldError
                                id="confirmPassword-error"
                                message={errors.confirmPassword.message}
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
                                Creating account...
                            </span>
                        ) : (
                            "Create account"
                        )}
                    </Button>

                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                        Login
                    </Link>

                </p>

            </div>
        </AuthLayout>
    );
}