import { FieldError } from "@/components/FieldError";
import { Message } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/layouts/AuthLayout";
import { loginUser } from "@/services/authService";
import { saveToken } from "@/utils/auth";
import { loginSchema } from "@/validations/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const errorInputClass =
        "border-red-400 bg-red-50/40 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-500/50 dark:bg-red-950/20";

    async function handleLogin(data) {
        const { email, password } = data;

        try {
            setLoading(true);
            setError("");

            const response = await loginUser({
                email,
                password
            });

            saveToken(response.token);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to login."
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
                        Welcome back
                    </p>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                        Sign in to PAuth
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Access your authentication accounts securely.
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
                    onSubmit={handleSubmit(handleLogin)}
                >

                    <div className="space-y-2">

                        <Label htmlFor="email">
                            Email
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
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
                                placeholder="Enter your password"
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

                        {errors.password && (
                            <FieldError
                                id="password-error"
                                message={errors.password.message}
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
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </Button>

                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                        Create account
                    </Link>
                </p>

            </div>
        </AuthLayout>
    );
}