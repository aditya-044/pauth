import { Button } from "@/components/ui/button";
import { getQrCode } from "@/services/accountService";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function QrCodeDialog({
    account,
    onClose
}) {
    const [qrCode, setQrCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadQr() {
            try {
                setLoading(true);
                setError("");

                const response = await getQrCode(account.id);

                if (!cancelled) {
                    setQrCode(response.qrCode);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load QR code."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadQr();

        return () => {
            cancelled = true;
        };
    }, [account.id]);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 dark:bg-black/60"
        >
            <div className="flex min-h-full items-center justify-center">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto scrollbar-none rounded-2xl border border-border bg-card p-5 shadow-xl"
                >
                    <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-foreground">
                                Setup QR code
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Scan this with an authenticator app for{" "}
                                {account.serviceName}.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="shrink-0"
                            aria-label="Close QR code"
                        >
                            <X size={18} />
                        </Button>

                    </div>

                    <div className="mt-4 flex min-h-52 items-center justify-center rounded-xl bg-muted/50 p-4">

                        {loading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
                                Loading QR code...
                            </div>
                        )}

                        {error && (
                            <p className="text-center text-sm text-destructive">
                                {error}
                            </p>
                        )}

                        {!loading && !error && qrCode && (
                            <img
                                src={qrCode}
                                alt={`QR code for ${account.serviceName}`}
                                className="h-52 w-52 max-w-full rounded-lg bg-white p-2"
                            />
                        )}

                        {!loading && !error && !qrCode && (
                            <p className="text-sm text-destructive">
                                QR code was not returned by the server.
                            </p>
                        )}

                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            type="button"
                            onClick={onClose}
                        >
                            Done
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}