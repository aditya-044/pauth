import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-medium transition-all duration-200 outline-none select-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "border-slate-900 bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow-md dark:border-violet-500 dark:bg-violet-500 dark:text-white dark:hover:bg-violet-600",

                outline:
                    "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800",

                secondary:
                    "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",

                ghost:
                    "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",

                destructive:
                    "border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md dark:bg-red-600 dark:hover:bg-red-700",

                link:
                    "border-transparent bg-transparent p-0 text-slate-900 underline-offset-4 hover:underline dark:text-slate-100",
            },

            size: {
                default:
                    "h-10 px-4",

                sm:
                    "h-9 px-4 text-xs",

                lg:
                    "h-11 px-5",

                icon:
                    "size-10",

                "icon-sm":
                    "size-9",

                "icon-lg":
                    "size-11",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(
                buttonVariants({
                    variant,
                    size,
                    className,
                })
            )}
            {...props}
        />
    );
}

export { Button, buttonVariants };