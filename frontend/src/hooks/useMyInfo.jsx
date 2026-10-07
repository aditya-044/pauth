import { getMe } from "@/services/authService";
import { useCallback, useEffect, useState } from "react";

export function useMyInfo() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUser = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMe();

            setUser(response.user || {});
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load user."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    return {
        user,
        loading,
        error,
        refresh: loadUser
    };
}