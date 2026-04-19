import { useEffect } from "react";

interface ToastNotice {
  type: "success" | "error";
  title: string;
  description: string;
}

export function useToast(
  toastNotice: ToastNotice | null,
  onDismiss: () => void,
  duration = 5000,
): void {
  useEffect(() => {
    if (!toastNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastNotice, onDismiss, duration]);
}
