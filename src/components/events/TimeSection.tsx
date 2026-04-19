"use client";

import { FieldGroup } from "@/components/ui/field";
import { FieldInput } from "./FieldInput";
import { getEventText } from "@/utils/event-locale";
import type { Language } from "@/utils";

interface TimeSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  lang: Language;
}

export function TimeSection({ form, lang }: TimeSectionProps) {
  const t = getEventText(lang);

  return (
    <section id="section-time">
      <FieldGroup>
        <div id="time-range" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FieldInput
            form={form}
            name="start_date"
            label={t.start}
            type="datetime-local"
            required
            requiredText={t.required}
            style={{ width: "max-content" }}
          />
          <FieldInput
            form={form}
            name="end_date"
            label={t.end}
            type="datetime-local"
            style={{ width: "max-content" }}
          />
        </div>
        <div aria-hidden="true" />
      </FieldGroup>
    </section>
  );
}
