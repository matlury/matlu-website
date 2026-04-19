"use client";

import { FieldGroup } from "@/components/ui/field";
import { FieldTextarea } from "./FieldTextarea";
import { getEventText } from "@/utils/event-locale";
import type { Language } from "@/utils";

interface DetailsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  lang: Language;
}

export function DetailsSection({ form, lang }: DetailsSectionProps) {
  const t = getEventText(lang);

  return (
    <section id="section-details">
      <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
        <FieldTextarea form={form} name="description_fi" label={t.descriptionFi} />
        <FieldTextarea form={form} name="description_en" label={t.descriptionEn} />
      </FieldGroup>
    </section>
  );
}
