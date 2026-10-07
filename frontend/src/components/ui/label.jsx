import * as React from "react";
import { cn } from "@/lib/utils";

function Label({
    className,
    ...props
}) {
    return (
        <label
            data-slot="label"
            className={cn(
                "flex items-center text-sm font-medium leading-none text-foreground select-none hover:cursor-pointer group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { Label };