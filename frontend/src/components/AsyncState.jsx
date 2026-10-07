import {
    AlertCircle,
    LoaderCircle
} from "lucide-react";

import { Button } from "./ui/button";

export function AsyncState({
    loading = false,
    error = null,
    onRefresh,
    loadingMsg = "Loading...",
    errorMsg = "Something went wrong."
}) {
    if (loading) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <div className="flex flex-col items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <LoaderCircle
                            size={24}
                            className="animate-spin text-primary"
                        />
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">
                        {loadingMsg}
                    </p>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <div className="flex max-w-sm flex-col items-center text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle
                            size={24}
                            className="text-destructive"
                        />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                        Something went wrong
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {error || errorMsg}
                    </p>

                    {onRefresh && (
                        <Button
                            onClick={onRefresh}
                            className="mt-4 h-11 px-5"
                        >
                            Try again
                        </Button>
                    )}

                </div>
            </div>
        );
    }

    return null;
}