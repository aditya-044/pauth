import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

function Input({
    className,
    type,
    ...props
}) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(
                "w-full min-w-0 rounded-md bg-slate-100 px-4 py-2.5 font-semibold text-slate-900 transition-colors outline-none placeholder:text-slate-400 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-50 dark:disabled:bg-slate-900 dark:disabled:text-slate-500 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
                className
            )}
            {...props}
        />
    );
}

export { Input };