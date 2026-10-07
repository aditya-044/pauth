import { Download, Upload, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { useBackup } from "../hooks/useBackup";
import { Message } from "../components/Message";
import { useState } from "react";
import { backupSchema } from "@/validations/backupValidation";

export default function Backup() {
    const {
        loading,
        error,
        success,
        exportBackup,
        importBackup
    } = useBackup();

    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState("");

    async function handleExport() {
        const data = await exportBackup();

        if (!data) {
            return;
        }

        const blob = new Blob(
            [JSON.stringify(data.backup, null, 2)],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "authenticator-backup.json";
        link.click();

        URL.revokeObjectURL(url);
    }

    async function handleImport() {
        if (!file) {
            return;
        }

        try {
            setFileError("");

            const text = await file.text();
            const data = JSON.parse(text);

            const validation = backupSchema.safeParse(data);

            if (!validation.success) {
                setFileError(
                    validation.error.issues[0]?.message ||
                    "Invalid backup file."
                );

                return;
            }

            await importBackup(validation.data);
            setFile(null);
        } catch (err) {
            console.log(err);

            setFileError(
                err.message === "Unexpected end of JSON input"
                    ? "The backup file is empty or corrupted."
                    : "Invalid backup file. Please select a valid JSON backup."
            );
        }
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files?.[0];

        setFileError("");
        setFile(selectedFile || null);
    }

    return (
        <div>

            <div className="flex flex-col gap-6 py-2 sm:py-3 lg:py-4">

                <div className="max-w-3xl">

                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
                        Protect your accounts
                    </p>

                    <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                        Backup & restore securely.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Create a secure backup of your authentication accounts or restore them from a previous backup.
                    </p>

                </div>

            </div>

            {success && (
                <Message type="success">
                    {success}
                </Message>
            )}

            {error && (
                <Message type="error">
                    {error}
                </Message>
            )}

            {fileError && (
                <Message type="error">
                    {fileError}
                </Message>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Download size={22} />
                    </div>

                    <h2 className="mt-4 text-base font-semibold text-foreground">
                        Backup your accounts
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        Export your authentication accounts into a backup file
                        that you can store securely.
                    </p>

                    <Button
                        onClick={handleExport}
                        disabled={loading}
                        className="mt-4 h-10 w-full px-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                Exporting backup...
                            </span>
                        ) : (
                            <>
                                <Download size={20} />
                                Export backup
                            </>
                        )}
                    </Button>

                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Upload size={22} />
                    </div>

                    <h2 className="mt-4 text-base font-semibold text-foreground">
                        Restore accounts
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        Restore your authentication accounts from an existing
                        backup file.
                    </p>

                    <input
                        key={file ? file.name : "empty"}
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileChange}
                        className="mt-4 block w-full cursor-pointer rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground"
                    />

                    {file && (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            Selected: {file.name}
                        </p>
                    )}

                    <Button
                        variant="outline"
                        disabled={!file || loading}
                        onClick={handleImport}
                        className="mt-3 h-10 w-full px-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
                                Restoring backup...
                            </span>
                        ) : (
                            <>
                                <Upload size={20} />
                                Restore backup
                            </>
                        )}
                    </Button>

                </div>

            </div>

            <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-sm">

                <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck size={22} />
                    </div>

                    <div>

                        <h2 className="font-semibold text-foreground">
                            Keep your backup secure
                        </h2>

                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                            Your backup contains the encryption key needed to restore
                            accounts. Store the file somewhere secure and never share
                            it with anyone you do not trust.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}