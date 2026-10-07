import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    getAccounts,
    getAccountCodes
} from "@/services/accountService";

export function useAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const timerRef = useRef(null);
    const refreshingRef = useRef(false);
    const refreshBackoffRef = useRef(0);
    const isMountedRef = useRef(true);

    const loadAccounts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAccounts();

            if (isMountedRef.current) {
                setAccounts(response.accounts || []);
                refreshBackoffRef.current = 0;
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load accounts."
                );
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    const refreshCodes = useCallback(async () => {
        if (refreshingRef.current || refreshBackoffRef.current > 0) {
            return;
        }

        refreshingRef.current = true;

        try {
            const response = await getAccountCodes();
            const codes = response.codes || [];

            if (isMountedRef.current) {
                setAccounts((currentAccounts) =>
                    currentAccounts.map((account) => {
                        const newCode = codes.find(
                            (item) =>
                                String(item.id) ===
                                String(account.id)
                        );

                        if (!newCode) {
                            return account;
                        }

                        return {
                            ...account,
                            currentCode: newCode.currentCode,
                            remainingTime: newCode.remainingTime
                        };
                    })
                );

                refreshBackoffRef.current = 0;
            }
        } catch (err) {
            console.error(
                "Unable to refresh account codes:",
                err
            );
            if (isMountedRef.current) {
                refreshBackoffRef.current = 5;
            }
        } finally {
            refreshingRef.current = false;
        }
    }, []);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    useEffect(() => {
        if (!accounts.length) {
            return;
        }

        timerRef.current = setInterval(() => {
            setAccounts((currentAccounts) =>
                currentAccounts.map((account) => {
                    const remaining =
                        Number(account.remainingTime);

                    if (!Number.isFinite(remaining)) {
                        return account;
                    }

                    return {
                        ...account,
                        remainingTime:
                            remaining > 1
                                ? remaining - 1
                                : 0
                    };
                })
            );

            if (refreshBackoffRef.current > 0) {
                refreshBackoffRef.current -= 1;
            }
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
            isMountedRef.current = false;
        };
    }, [accounts.length]);

    useEffect(() => {
        if (!accounts.length) {
            return;
        }

        const hasExpiredAccount = accounts.some(
            (account) =>
                Number(account.remainingTime) <= 0
        );

        if (hasExpiredAccount) {
            refreshCodes();
        }
    }, [accounts, refreshCodes]);

    const refresh = useCallback(async () => {
        await loadAccounts();
    }, [loadAccounts]);

    return {
        accounts,
        loading,
        error,
        refresh,
        refreshCodes
    };
}