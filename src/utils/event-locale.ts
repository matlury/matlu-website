import type { Language } from "@/utils";
import eventRequestFi from "../../public/locales/fi/event-request.json";
import eventRequestEn from "../../public/locales/en/event-request.json";

export const eventResources = {
  fi: eventRequestFi,
  en: eventRequestEn,
} as const;

export function getEventText(lang: Language) {
  return eventResources[lang];
}
