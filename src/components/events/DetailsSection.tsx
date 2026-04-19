"use client";

import { FieldGroup } from "@/components/ui/field";
import { FieldTextarea } from "./FieldTextarea";
import type { TEXT } from "@/locales/event-request";

interface DetailsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  t: (typeof TEXT)["en"] | (typeof TEXT)["fi"];
}

export function DetailsSection({ form, t }: DetailsSectionProps) {
  return (
    <section id="section-details">
      <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
        <FieldTextarea form={form} name="description_fi" label={t.descriptionFi} />
        <FieldTextarea form={form} name="description_en" label={t.descriptionEn} />
      </FieldGroup>
    </section>
  );
}
