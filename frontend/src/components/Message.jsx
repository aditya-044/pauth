import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export function Message({
    type,
    children,
    duration = 5000,
    onClose
}) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!onClose) return;

        const timer = setTimeout(() => {
            onCloseRef.current?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (type === "success") {
        return (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="shrink-0" />
                    <span>{children}</span>
                </div>
            </div>
        );
    }

    if (type === "error") {
        return (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{children}</span>
                </div>
            </div>
        );
    }

    return null;
}