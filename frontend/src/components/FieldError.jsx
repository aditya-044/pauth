import { AlertCircle } from "lucide-react";

export const FieldError = ({ message, id }) => {
    if (!message) return null;

    return (
        <p
            id={id}
            role="alert"
            className="flex items-center gap-1.5 text-sm font-medium text-destructive"
        >
            <AlertCircle
                size={13}
                className="shrink-0"
            />
            <span>{message}</span>
        </p>
    );
};