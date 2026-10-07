import { useCallback, useState } from "react";
import { backupExport, backupImport } from "../services/backupService";

export function useBackup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const exportBackup = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data = await backupExport();

            return data;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to export backup."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const importBackup = useCallback(async (data) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await backupImport(data);

            setSuccess(
                response.message ||
                "Backup imported successfully."
            );

            return response;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to import backup."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        success,
        exportBackup,
        importBackup
    };
}