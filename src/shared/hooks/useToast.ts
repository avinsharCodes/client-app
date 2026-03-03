import { toast as sonnerToast } from "sonner"

export function useToast() {
    return {
        toast: sonnerToast,
        error: (msg: string) => sonnerToast.error(msg),
        success: (msg: string) => sonnerToast.success(msg),
        info: (msg: string) => sonnerToast.info(msg),
    }
}
