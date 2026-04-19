"use client";

import { createPortal } from "react-dom";
import styled from "styled-components";

type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  title: string;
  description: string;
  onClose: () => void;
  closeAriaLabel?: string;
}

const ToastContainer = styled.div<{ $type: ToastType }>`
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 120;
  width: min(360px, calc(100vw - 1.5rem));
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #fff;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  background: ${props => props.$type === "success" ? "#059669" : "#dc2626"};
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const ToastTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: var(--line-height-h3);
  margin: 0;
`;

const ToastDescription = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: var(--line-height-body);
  opacity: 0.95;
`;

export function Toast({
  type,
  title,
  description,
  onClose,
  closeAriaLabel = "Close notification",
}: ToastProps): ReturnType<typeof createPortal> | null {
  return createPortal(
    <ToastContainer $type={type}>
      <ToastHeader>
        <div>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </div>
        <button
          type="button"
          aria-label={closeAriaLabel}
          style={{
            borderRadius: "6px",
            padding: "0.25rem",
            color: "rgba(255,255,255,0.9)",
            border: 0,
            background: "transparent",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          ×
        </button>
      </ToastHeader>
    </ToastContainer>,
    document.body,
  );
}
