import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/shared/utils/index"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "default" | "lg" | "icon"
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        icon: "h-10 w-10",
    }

    return (
        <div
            className={cn("inline-flex items-center justify-center", className)}
            {...props}
        >
            <Loader2
                className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
            />
            <span className="sr-only">Loading…</span>
        </div>
    )
}
