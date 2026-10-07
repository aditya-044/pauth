import {
    Check,
    Copy,
    KeyRound,
    MoreHorizontal,
    Pencil,
    QrCode,
    ShieldCheck,
    Trash
} from "lucide-react";

import { Button } from "./ui/button";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { deleteAccount } from "../services/accountService";

import { QrCodeDialog } from "./QrCodeDialog";
import { VerifyOtpDialog } from "./VerifyOtpDialog";

export function AccountCard({
    account,
    onDeleted,
    onDeleteError,
    onDeleteSuccess
}) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [showVerify, setShowVerify] = useState(false);

    const navigate = useNavigate();

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                showMenu &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [showMenu]);

    async function copyCode(code) {
        try {
            await navigator.clipboard.writeText(code);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.log(
                "Failed to copy code:",
                err
            );
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${account.serviceName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await deleteAccount(id);

            onDeleted?.();
            onDeleteSuccess?.();
        } catch (err) {
            onDeleteError?.(
                err.response?.data?.message ||
                "Unable to delete account."
            );
        } finally {
            setDeleting(false);
            setShowMenu(false);
        }
    }

    const serviceName =
        account.serviceName?.replace(
            /\b[a-z]/g,
            (ch) => ch.toUpperCase()
        ) || "";

    const period =
        account.period || 60;

    const remainingTime =
        Number(account.remainingTime) || 0;

    const progress = Math.max(
        0,
        Math.min(
            100,
            (remainingTime / period) * 100
        )
    );

    return (
        <>
            <div
                className="rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm transition-all hover:border-primary/30"
            >
                <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold uppercase text-primary">
                            {account.serviceName?.charAt(0)}
                        </div>

                        <div className="min-w-0">

                            <h3 className="font-semibold text-foreground">
                                {serviceName}
                            </h3>

                            <p className="truncate text-sm text-muted-foreground">
                                {account.account}
                            </p>

                        </div>

                    </div>

                    {/* Account options */}
                    <div
                        ref={menuRef}
                        className="relative"
                    >
                        <Button
                            onClick={() =>
                                setShowMenu(
                                    (prev) => !prev
                                )
                            }
                            variant="ghost"
                            size="icon"
                            disabled={deleting}
                            className="hover:bg-primary/10 hover:text-primary"
                            aria-label="Account options"
                        >
                            <MoreHorizontal size={18} />
                        </Button>

                        {showMenu && (
                            <div
                                className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
                            >

                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowMenu(false);

                                        navigate(
                                            `/accounts/${account.id}/edit`
                                        );
                                    }}
                                    className="flex w-full justify-start gap-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                                >
                                    <Pencil size={16} />
                                    Edit account
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowQr(true);
                                    }}
                                    className="flex w-full justify-start gap-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                                >
                                    <QrCode size={16} />
                                    Show QR
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowVerify(true);
                                    }}
                                    className="flex w-full justify-start gap-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                                >
                                    <ShieldCheck size={16} />
                                    Verify code
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowMenu(false);

                                        navigate(
                                            `/recovery/${account.id}`
                                        );
                                    }}
                                    className="flex w-full justify-start gap-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                                >
                                    <KeyRound size={16} />
                                    Use recovery code
                                </Button>

                                <Button
                                    variant="ghost"
                                    disabled={deleting}
                                    onClick={() =>
                                        handleDelete(
                                            account.id
                                        )
                                    }
                                    className="flex w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                                >
                                    <Trash size={16} />

                                    {deleting
                                        ? "Deleting..."
                                        : "Delete account"}
                                </Button>

                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-4 flex items-end justify-between">

                    <div className="min-w-0">

                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Verification Code
                        </p>

                        <p className="mt-1 truncate font-mono text-xl font-bold tracking-[0.16em] text-foreground sm:text-2xl sm:tracking-[0.18em]">
                            {account.currentCode}
                        </p>

                    </div>

                    <Button
                        onClick={() =>
                            copyCode(
                                account.currentCode
                            )
                        }
                        variant="ghost"
                        size="icon"
                        className="ml-3 shrink-0 hover:bg-primary/10 hover:text-primary"
                        aria-label="Copy verification code"
                    >
                        {copied ? (
                            <Check size={16} />
                        ) : (
                            <Copy size={16} />
                        )}
                    </Button>

                </div>

                <div className="mt-3">

                    <div className="flex items-center justify-between text-xs text-muted-foreground">

                        <span>
                            Refreshes automatically
                        </span>

                        <span>
                            {remainingTime}s
                        </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">

                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                                width: `${progress}%`
                            }}
                        />

                    </div>

                </div>

            </div>

            {showQr && (
                <QrCodeDialog
                    account={account}
                    onClose={() =>
                        setShowQr(false)
                    }
                />
            )}

            {showVerify && (
                <VerifyOtpDialog
                    account={account}
                    onClose={() =>
                        setShowVerify(false)
                    }
                />
            )}
        </>
    );
}