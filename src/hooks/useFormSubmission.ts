import { useState, useCallback } from "react";
import axios from "axios";

type Status = "idle" | "submitting" | "success" | "error";

interface UseFormSubmissionResult {
  status: Status;
  message: string;
  toastNotice: { type: "success" | "error"; title: string; description: string } | null;
  setStatus: (s: Status) => void;
  setMessage: (m: string) => void;
  setToastNotice: (t: { type: "success" | "error"; title: string; description: string } | null) => void;
  reset: () => void;
  parseAxiosError: (error: unknown, fallbackMessage: string) => string;
}

export function useFormSubmission(): UseFormSubmissionResult {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [toastNotice, setToastNotice] = useState<{
    type: "success" | "error";
    title: string;
    description: string;
  } | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setToastNotice(null);
  }, []);

  const parseAxiosError = useCallback((error: unknown, fallbackMessage: string): string => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (data?.error?.message) {
        return data.error.message;
      }
      if (typeof data === "string") {
        return data;
      }
      if (data) {
        return JSON.stringify(data);
      }
      return error.message;
    }
    return String(error);
  }, []);

  return {
    status,
    message,
    toastNotice,
    setStatus,
    setMessage,
    setToastNotice,
    reset,
    parseAxiosError,
  };
}
