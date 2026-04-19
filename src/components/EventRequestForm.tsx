"use client";

import React, { useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useForm } from "@tanstack/react-form";
import { Language } from "../utils";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import { TEXT } from "@/locales/event-request";
import { API_ENDPOINTS, RECAPTCHA_SITE_KEY } from "@/api";
import {
  parseOptionalCoordinate,
  toIsoDateTime,
  validateCoordinates,
  validateDates,
  validateRecaptcha,
  extractErrorMessage,
} from "@/utils/form-utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useToast } from "@/hooks/useToast";
import { TitleSection } from "./events/TitleSection";
import { TimeSection } from "./events/TimeSection";
import { OrganizerSection } from "./events/OrganizerSection";
import { DetailsSection } from "./events/DetailsSection";
import { LocationSection } from "./events/LocationSection";
import { SubmitSection } from "./events/SubmitSection";
import { AsideNavigation } from "./events/AsideNavigation";

type Status = "idle" | "submitting" | "success" | "error";

interface LocationSuggestion {
  documentId: string;
  label_fi: string;
  label_en: string;
  latitude: number | null;
  longitude: number | null;
}

interface TitleSuggestion {
  fi: string;
  en: string;
}

interface EventRequestFormProps {
  lang: Language;
  initialLocationSuggestions?: LocationSuggestion[];
  initialTitleSuggestions?: TitleSuggestion[];
}

interface FormValues {
  title_fi: string;
  title_en: string;
  start_date: string;
  end_date: string;
  organizer_name: string;
  event_link: string;
  pricing_type: "free" | "paid";
  price: string;
  location_fi: string;
  location_en: string;
  latitude: string;
  longitude: string;
  description_fi: string;
  description_en: string;
}

export default function EventRequestForm({
  lang,
  initialLocationSuggestions = [],
  initialTitleSuggestions = [],
}: EventRequestFormProps) {
  const t = TEXT[lang];
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [titleFiBlurred, setTitleFiBlurred] = useState(false);
  const [titleSuggestions] = useState<TitleSuggestion[]>(initialTitleSuggestions);
  const [locationSuggestions] = useState<LocationSuggestion[]>(initialLocationSuggestions);
  const [confirmPopoverOpen, setConfirmPopoverOpen] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [toastNotice, setToastNotice] = useState<{
    type: "success" | "error";
    title: string;
    description: string;
  } | null>(null);

  useToast(toastNotice, () => setToastNotice(null));

  const sectionItems = useMemo(
    () => [
      { id: "section-title", label: lang === "fi" ? "Tapahtuman nimi" : "Event title" },
      { id: "section-time", label: lang === "fi" ? "Aikavali" : "Time range" },
      { id: "section-organizer", label: lang === "fi" ? "Jarjestajataho" : "Organizer" },
      { id: "section-location", label: lang === "fi" ? "Sijainti" : "Location" },
      { id: "section-details", label: lang === "fi" ? "Lisatiedot" : "Details" },
      { id: "section-submit", label: lang === "fi" ? "Laheta" : "Submit" },
    ],
    [lang],
  );

  const { activeSection, setActiveSection } = useScrollSpy(
    sectionItems,
    scrollContainerRef,
    sectionItems[0]?.id || "section-title",
  );

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    setActiveSection(sectionId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const form = useForm({
    defaultValues: {
      title_fi: "",
      title_en: "",
      start_date: "",
      end_date: "",
      organizer_name: "",
      event_link: "",
      pricing_type: "free" as const,
      price: "",
      location_fi: "",
      location_en: "",
      latitude: "",
      longitude: "",
      description_fi: "",
      description_en: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setStatus("submitting");
      setMessage("");

      const startDate = toIsoDateTime(value.start_date);
      const endDate = value.end_date ? toIsoDateTime(value.end_date) : null;

      const dateError = validateDates(startDate, endDate, value.end_date, {
        invalidDate: t.error,
        endDateBeforeStart: t.endDateBeforeStart,
      });
      if (dateError) {
        setStatus("error");
        setMessage(dateError);
        return;
      }

      const coordError = validateCoordinates(value.latitude, value.longitude, {
        pairRequired: t.coordinatesPairRequired,
        invalid: t.coordinatesInvalid,
      });
      if (coordError) {
        setStatus("error");
        setMessage(coordError);
        return;
      }

      const recaptchaToken = RECAPTCHA_SITE_KEY
        ? recaptchaRef.current?.getValue() || ""
        : "";

      const recaptchaError = validateRecaptcha(!!RECAPTCHA_SITE_KEY, recaptchaToken, t.recaptchaRequired);
      if (recaptchaError) {
        setStatus("error");
        setMessage(recaptchaError);
        return;
      }

      const isFree = value.pricing_type === "free";
      const latitude = parseOptionalCoordinate(value.latitude);
      const longitude = parseOptionalCoordinate(value.longitude);

      const payload = {
        organizer_name: value.organizer_name.trim(),
        price: isFree ? (lang === "fi" ? "Ilmainen" : "Free") : value.price.trim(),
        start_date: startDate,
        end_date: endDate,
        event_link: value.event_link.trim(),
        title: {
          fi: value.title_fi.trim(),
          en: value.title_en.trim(),
        },
        location: {
          fi: value.location_fi.trim(),
          en: value.location_en.trim(),
        },
        latitude,
        longitude,
        description: {
          fi: value.description_fi.trim(),
          en: value.description_en.trim(),
        },
        recaptchaToken,
      };

      try {
        await axios.post(API_ENDPOINTS.SUBMIT_EVENT, payload);
        form.reset();
        if (RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset();
        setLocationSearchInput("");
        setTitleFiBlurred(false);
        setStatus("success");
        setMessage(t.success);
        setToastNotice({
          type: "success",
          title: t.addEventToast,
          description: t.success,
        });
      } catch (error) {
        const errorMessage = extractErrorMessage(error, t.error);
        console.error("[event-request] unexpected submit error", {
          endpoint: API_ENDPOINTS.SUBMIT_EVENT,
          message: errorMessage,
        });
        setStatus("error");
        setMessage(errorMessage || t.error);
        setToastNotice({
          type: "error",
          title: t.submitFailedToast,
          description: t.error,
        });
      }
    },
  });

  return (
    <form.Subscribe selector={(state) => [state.values.latitude, state.values.longitude, state.values.title_fi]}>
      {([latitudeVal, longitudeVal, titleFiVal]) => {
        const debouncedLat = useDebouncedValue(latitudeVal);
        const debouncedLon = useDebouncedValue(longitudeVal);

        const latitudeValue = parseOptionalCoordinate(debouncedLat);
        const longitudeValue = parseOptionalCoordinate(debouncedLon);
        const mapLatitude = Number.isFinite(latitudeValue) ? (latitudeValue as number) : undefined;
        const mapLongitude = Number.isFinite(longitudeValue) ? (longitudeValue as number) : undefined;
        const titleDatalistId = `event-title-suggestions-${lang}`;
        const showEnglishTitle = titleFiBlurred || titleFiVal.trim().length > 0;

        return (
          <>
            {toastNotice && (
              <Toast
                type={toastNotice.type}
                title={toastNotice.title}
                description={toastNotice.description}
                onClose={() => setToastNotice(null)}
                closeAriaLabel={lang === "fi" ? "Sulje ilmoitus" : "Close notification"}
              />
            )}

            <DialogContent
              showCloseButton={false}
              style={{
                zIndex: 110,
                maxHeight: "90vh",
                width: "100%",
                maxWidth: "50em",
                overflow: "visible",
                borderRadius: "1rem",
                border: "1px solid #e2e8f0",
                background: "white",
                padding: 0,
                color: "#0f172a",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              }}
            >
              <DialogHeader
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "1rem 1.5rem 0.375rem 1.5rem",
                }}
              >
                <DialogTitle style={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.1, color: "#0f172a", margin: 0 }}>
                  {t.title}
                </DialogTitle>
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label={lang === "fi" ? "Sulje dialogi" : "Close dialog"}
                    style={{
                      marginLeft: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "1.875rem", lineHeight: 1 }}>&times;</span>
                  </button>
                </DialogClose>
              </DialogHeader>

              <div
                ref={scrollContainerRef}
                style={{
                  maxHeight: "calc(90vh - 88px)",
                  overflowY: "auto",
                  padding: "0 1.5rem 1.5rem",
                }}
              >
                <DialogDescription style={{ fontSize: "1rem", color: "#475569", margin: "0.75rem 0 0" }}>
                  {t.description}
                </DialogDescription>

                <form
                  ref={formRef}
                  onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void form.handleSubmit();
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                >
                  <TitleSection
                    form={form}
                    lang={lang}
                    titleDatalistId={titleDatalistId}
                    titleSuggestions={titleSuggestions}
                    showEnglishTitle={showEnglishTitle}
                    setTitleFiBlurred={setTitleFiBlurred}
                  />

                  <TimeSection form={form} lang={lang} />

                  <OrganizerSection form={form} lang={lang} />

                  <DetailsSection form={form} lang={lang} />

                  <LocationSection
                    form={form}
                    lang={lang}
                    locationSearchInput={locationSearchInput}
                    setLocationSearchInput={setLocationSearchInput}
                    locationSuggestions={locationSuggestions}
                    mapLatitude={mapLatitude}
                    mapLongitude={mapLongitude}
                  />

                  {RECAPTCHA_SITE_KEY && (
                    <div>
                      <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} />
                    </div>
                  )}

                  <p style={{ fontSize: "0.875rem", color: "#475569", margin: "0 0 1rem 0" }}>
                    {t.adminReviewNote}
                  </p>

                  <SubmitSection
                    form={form}
                    lang={lang}
                    status={status}
                    message={message}
                    confirmPopoverOpen={confirmPopoverOpen}
                    setConfirmPopoverOpen={setConfirmPopoverOpen}
                  />
                </form>
              </div>

              <AsideNavigation
                sectionItems={sectionItems}
                activeSection={activeSection}
                onNavigate={scrollToSection}
                navigationLabel={t.navigation}
              />
            </DialogContent>
          </>
        );
      }}
    </form.Subscribe>
  );
}
