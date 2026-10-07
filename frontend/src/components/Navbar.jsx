import {
    LogOut,
    ShieldCheck,
    Menu,
    X,
    Sun,
    Moon,
    LogIn,
    UserPlus
} from "lucide-react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import { Button } from "./ui/button";
import { getToken, removeToken } from "@/utils/auth";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export function Navbar() {
    const navigate = useNavigate();

    const {
        resolvedTheme,
        setTheme
    } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const isAuthenticated = !!getToken();

    async function handleLogout() {
        const confirmed = window.confirm(
            "Are you sure you want to log out?"
        );

        if (!confirmed) return;

        removeToken();
        navigate("/");
    }

    function handleThemeToggle() {
        setTheme(
            resolvedTheme === "dark"
                ? "light"
                : "dark"
        );
    }

    function handleNavClick() {
        setMobileMenuOpen(false);
    }

    function handleLogoutClick() {
        setMobileMenuOpen(false);
        handleLogout();
    }

    const navItems = isAuthenticated ? [
        {
            label: "Dashboard",
            path: "/dashboard"
        },
        {
            label: "Accounts",
            path: "/accounts"
        },
        {
            label: "Backup",
            path: "/backup"
        }
    ] : [];

    return (
        <header className="border-b border-border bg-background px-5 pt-1 sm:px-4">
            <div className="flex items-center justify-between gap-2">

                <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <ShieldCheck size={30} />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-foreground">
                        PAuth
                    </span>
                </div>

                <div className="flex items-center gap-2">

                    <nav className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `rounded-t-lg px-3 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-foreground"
                                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleThemeToggle}
                            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            aria-label="Toggle theme"
                        >
                            {resolvedTheme === "dark" ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                        </Button>

                        {isAuthenticated ? (
                            <Button
                                onClick={handleLogout}
                                className="h-11 px-4"
                            >
                                <LogOut size={18} />
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/login")}
                                    className="h-11 px-4"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Button>
                                <Button
                                    onClick={() => navigate("/register")}
                                    className="h-11 px-4"
                                >
                                    <UserPlus size={18} />
                                    Register
                                </Button>
                            </>
                        )}

                    </div>

                    <div className="flex items-center gap-2 md:hidden">

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleThemeToggle}
                            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            aria-label="Toggle theme"
                        >
                            {resolvedTheme === "dark" ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setMobileMenuOpen(
                                    (prev) => !prev
                                )
                            }
                            className="h-11 w-11 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </Button>

                    </div>

                </div>
            </div>

            {mobileMenuOpen && (
                <nav className="border-t border-border bg-background py-3 md:hidden">
                    <div className="flex flex-col gap-2">

                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `w-full rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-foreground"
                                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                                    }`
                                }
                                onClick={handleNavClick}
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        {isAuthenticated ? (
                            <Button
                                onClick={handleLogoutClick}
                                className="h-11 px-3"
                            >
                                <LogOut size={18} />
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        handleNavClick();
                                        navigate("/login");
                                    }}
                                    className="h-11 px-3"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleNavClick();
                                        navigate("/register");
                                    }}
                                    className="h-11 px-3"
                                >
                                    <UserPlus size={18} />
                                    Register
                                </Button>
                            </>
                        )}

                    </div>
                </nav>
            )}
        </header>
    );
}