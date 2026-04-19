"use client";

import { FieldGroup } from "@/components/ui/field";
import { FieldInput } from "./FieldInput";
import { getEventText } from "@/utils/event-locale";
import type { Language } from "@/utils";

interface TitleSuggestion {
  fi: string;
  en: string;
}

interface TitleSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  lang: Language;
  titleDatalistId: string;
  titleSuggestions: TitleSuggestion[];
  showEnglishTitle: boolean;
  setTitleFiBlurred: (v: boolean) => void;
}

export function TitleSection({
  form,
  lang,
  titleDatalistId,
  titleSuggestions,
  showEnglishTitle,
  setTitleFiBlurred,
}: TitleSectionProps) {
  const t = getEventText(lang);

  return (
    <section id="section-title">
      <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
        <FieldInput
          form={form}
          name="title_fi"
          label={t.titleFi}
          required
          requiredText={t.required}
          hint={t.titleFiHint}
          datalist={titleDatalistId}
          onBlurExtra={() => setTitleFiBlurred(true)}
          onValueChange={(value) => {
            const match = titleSuggestions.find((item) => item.fi === value);
            if (match) {
              form.setFieldValue("title_en", match.en || "");
            }
          }}
        />
        <datalist id={titleDatalistId}>
          {titleSuggestions.map((item) => (
            <option key={`${item.fi}-${item.en}`} value={item.fi} />
          ))}
        </datalist>

        {showEnglishTitle && (
          <FieldInput
            form={form}
            name="title_en"
            label={t.titleEn}
            required
            requiredText={t.required}
          />
        )}
      </FieldGroup>
    </section>
  );
}
