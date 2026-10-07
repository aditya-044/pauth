import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const ThemeContext = createContext(null);

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getInitialTheme() {
    const stored = localStorage.getItem("theme");

    if (
        stored === "light" ||
        stored === "dark" ||
        stored === "system"
    ) {
        return stored;
    }

    return "system";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    const [resolvedTheme, setResolvedTheme] = useState(() => {
        const initialTheme = getInitialTheme();

        if (initialTheme === "system") {
            return getSystemTheme();
        }

        return initialTheme;
    });

    useEffect(() => {
        const root = document.documentElement;

        function applyTheme() {
            const resolved =
                theme === "system"
                    ? getSystemTheme()
                    : theme;

            root.classList.remove("light", "dark");
            root.classList.add(resolved);

            setResolvedTheme(resolved);
        }

        applyTheme();

        if (theme !== "system") {
            return;
        }

        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        function handleSystemThemeChange() {
            applyTheme();
        }

        mediaQuery.addEventListener(
            "change",
            handleSystemThemeChange
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                handleSystemThemeChange
            );
        };
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used within a ThemeProvider"
        );
    }

    return context;
}