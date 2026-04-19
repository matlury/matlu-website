"use client";

import { Box, Popover } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { getEventText } from "@/utils/event-locale";
import type { Language } from "@/utils";

type Status = "idle" | "submitting" | "success" | "error";

interface SubmitSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  lang: Language;
  status: Status;
  message: string;
  confirmPopoverOpen: boolean;
  setConfirmPopoverOpen: (v: boolean) => void;
}

export function SubmitSection({
  form,
  lang,
  status,
  message,
  confirmPopoverOpen,
  setConfirmPopoverOpen,
}: SubmitSectionProps) {
  const t = getEventText(lang);

  return (
    <section
      id="section-submit"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "0.75rem",
        padding: "1rem 0",
        position: "sticky",
        bottom: 0,
        zIndex: 100,
      }}
    >
      {message && (
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155", margin: 0, background: "rgba(255,255,255,0.8)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
          {message}
        </p>
      )}

      <Popover.Root open={confirmPopoverOpen} onOpenChange={(e) => setConfirmPopoverOpen(e.open)}>
        <Popover.Trigger asChild>
          <Button
            type="button"
            disabled={status === "submitting"}
            style={{ background: "#0149bc", color: "#ffffff", height: "2.5rem", borderRadius: "8px", padding: "0 1.5rem", fontWeight: 600, fontSize: "0.875rem" }}
          >
            {status === "submitting" ? t.sending : t.submit}
          </Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content borderRadius="12px" p={4} border="1px solid #e2e8f0" boxShadow="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)">
            <Popover.CloseTrigger />
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body>
              <Popover.Title>{t.confirmTitle}</Popover.Title>
              <p style={{ fontSize: "0.875rem", color: "#475569", marginBottom: "1rem", textAlign: "left", lineHeight: "1.5" }}>
                {t.confirmQuestion}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmPopoverOpen(false)}
                  style={{ color: "#64748b", padding: "0 1rem" }}
                >
                  {t.cancel}
                </Button>
                <Button
                  size="sm"
                  style={{ background: "#0149bc", color: "#fff", padding: "0 1rem" }}
                  onClick={() => {
                    setConfirmPopoverOpen(false);
                    void form.handleSubmit();
                  }}
                >
                  {t.confirmAction}
                </Button>
              </div>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </section>
  );
}
