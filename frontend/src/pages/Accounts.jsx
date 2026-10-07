import { AccountCard } from "@/components/AccountCard";
import { Message } from "@/components/Message";
import { AsyncState } from "@/components/AsyncState";
import { Button } from "@/components/ui/button";
import { useAccounts } from "@/hooks/useAccounts";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Accounts() {
    const {
        accounts,
        loading,
        error,
        refresh
    } = useAccounts();

    const navigate = useNavigate();

    const [deleteError, setDeleteError] =
        useState("");

    const [deleteSuccess, setDeleteSuccess] =
        useState("");

    function handleDeleteError(errorMessage) {
        setDeleteError(errorMessage);
        setDeleteSuccess("");
    }

    function handleDeleteSuccess() {
        setDeleteSuccess(
            "Account deleted successfully."
        );

        setDeleteError("");
    }

    if (loading || error) {
        return (
            <AsyncState
                loading={loading}
                error={error}
                loadingMsg="Loading accounts..."
                onRefresh={refresh}
            />
        );
    }

    return (
        <div>

            <div className="flex flex-col gap-6 py-2 sm:py-3 lg:py-4">

                <div className="max-w-3xl">

                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
                        Manage your accounts
                    </p>

                    <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                        Your authentication accounts.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Add, manage and secure your authentication accounts from one place.
                    </p>

                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                    <Button
                        onClick={() =>
                            navigate("/accounts/new")
                        }
                        className="h-10 px-4"
                    >
                        <Plus size={20} />
                        Add account
                    </Button>

                </div>

            </div>

            {deleteSuccess && (
                <Message
                    type="success"
                    onClose={() =>
                        setDeleteSuccess("")
                    }
                >
                    {deleteSuccess}
                </Message>
            )}

            {deleteError && (
                <Message
                    type="error"
                    onClose={() =>
                        setDeleteError("")
                    }
                >
                    {deleteError}
                </Message>
            )}

            {accounts.length === 0 ? (

                <div className="mt-8 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50">

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            navigate("/accounts/new")
                        }
                        className="h-11 w-11 rounded-xl bg-card shadow-sm hover:bg-primary/10 hover:text-primary"
                    >
                        <Plus size={24} />
                    </Button>

                    <h2 className="mt-4 font-semibold text-foreground">
                        No accounts yet
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add your first authentication account.
                    </p>

                    <Button
                        onClick={() =>
                            navigate("/accounts/new")
                        }
                        className="mt-4 h-10 px-4"
                    >
                        <Plus size={20} />
                        Add account
                    </Button>

                </div>

            ) : (

                <div className="mt-8 grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

                    {accounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onDeleted={refresh}
                            onDeleteError={
                                handleDeleteError
                            }
                            onDeleteSuccess={
                                handleDeleteSuccess
                            }
                        />
                    ))}

                </div>

            )}

        </div>
    );
}