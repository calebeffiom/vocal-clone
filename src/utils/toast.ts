import toast from "react-hot-toast";

const COOLDOWN_MS = 2000;
const DEFAULT_DURATION = 3000;

const lastShown: Record<string, number> = {};

function getKey(type: "success" | "error", message: string) {
  return `${type}:${message}`;
}

export const debouncedToast = {
  success: (message: string, options?: { id?: string; duration?: number }) => {
    const key = getKey("success", message);
    if (Date.now() - (lastShown[key] ?? 0) < COOLDOWN_MS) return;
    lastShown[key] = Date.now();
    toast.success(message, {
      duration: options?.duration ?? DEFAULT_DURATION,
      ...options,
    });
  },
  error: (message: string, options?: { id?: string; duration?: number }) => {
    const key = getKey("error", message);
    if (Date.now() - (lastShown[key] ?? 0) < COOLDOWN_MS) return;
    lastShown[key] = Date.now();
    toast.error(message, {
      duration: options?.duration ?? DEFAULT_DURATION,
      ...options,
    });
  },
};

export { toast };
