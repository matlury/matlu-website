"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import ReCAPTCHA from "react-google-recaptcha";
import { Button as ChakraButton, Text, HStack, Box, Input as ChakraInput, InputGroup } from "@chakra-ui/react";
import { FaEuroSign } from "react-icons/fa";
import axios from "axios";
import styled from "styled-components";
import { Language } from "../utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/ui/TextInput";
import { TextareaInput } from "@/components/ui/TextareaInput";
import { TEXT } from "@/locales/event-request";
import { API_ENDPOINTS, RECAPTCHA_SITE_KEY } from "@/api";

type Status = "idle" | "submitting" | "success" | "error";
type ToastType = "success" | "error";

interface ToastNotice {
  type: ToastType;
  title: string;
  description: string;
}

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

const LeafletLocationMap = dynamic(() => import("./LeafletLocationMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "260px",
        width: "100%",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        background: "#f1f5f9",
      }}
    />
  ),
});

function toIsoDateTime(value: string): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

function parseOptionalCoordinate(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverTitle,
} from "@/components/ui/popover";

export default function EventRequestForm({
  lang,
  initialLocationSuggestions = [],
  initialTitleSuggestions = [],
}: EventRequestFormProps) {
  const t = TEXT[lang];
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [toastNotice, setToastNotice] = useState<ToastNotice | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [locationFiInput, setLocationFiInput] = useState("");
  const [locationEnInput, setLocationEnInput] = useState("");
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [titleFiInput, setTitleFiInput] = useState("");
  const [titleEnInput, setTitleEnInput] = useState("");
  const [titleFiBlurred, setTitleFiBlurred] = useState(false);
  const [titleSuggestions] = useState<TitleSuggestion[]>(initialTitleSuggestions);
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [locationSuggestions] = useState<LocationSuggestion[]>(initialLocationSuggestions);
  const [isFree, setIsFree] = useState(true);
  const [priceInput, setPriceInput] = useState("");

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
  const [activeSection, setActiveSection] = useState(sectionItems[0]?.id || "section-title");

  useEffect(() => {
    if (!toastNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastNotice(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastNotice]);

  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) {
      return;
    }

    const root = scrollContainerRef.current;
    const elements = sectionItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-15% 0px -55% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [isOpen, sectionItems]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    setActiveSection(sectionId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  function handleConfirmSubmit() {
    setIsPopoverOpen(false);
    if (formRef.current) {
      const event = new Event("submit", { cancelable: true, bubbles: true });
      formRef.current.dispatchEvent(event);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const startDateRaw = getFormString(formData, "start_date");
    const endDateRaw = getFormString(formData, "end_date");
    const latitudeRaw = getFormString(formData, "latitude");
    const longitudeRaw = getFormString(formData, "longitude");
    const startDate = toIsoDateTime(startDateRaw);
    const endDate = endDateRaw ? toIsoDateTime(endDateRaw) : null;
    const latitude = parseOptionalCoordinate(latitudeRaw);
    const longitude = parseOptionalCoordinate(longitudeRaw);

    if (!startDate || (endDateRaw && !endDate)) {
      setStatus("error");
      setMessage(t.error);
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setStatus("error");
      setMessage(t.endDateBeforeStart);
      return;
    }

    if ((latitude === null) !== (longitude === null)) {
      setStatus("error");
      setMessage(t.coordinatesPairRequired);
      return;
    }

    if (
      (latitudeRaw && !Number.isFinite(latitude)) ||
      (longitudeRaw && !Number.isFinite(longitude)) ||
      (latitude !== null && (latitude < -90 || latitude > 90)) ||
      (longitude !== null && (longitude < -180 || longitude > 180))
    ) {
      setStatus("error");
      setMessage(t.coordinatesInvalid);
      return;
    }

    const recaptchaToken = RECAPTCHA_SITE_KEY
      ? recaptchaRef.current?.getValue() || ""
      : "";

    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      setStatus("error");
      setMessage(t.recaptchaRequired);
      return;
    }

    const payload = {
      organizer_name: getFormString(formData, "organizer_name"),
      price: isFree ? (lang === "fi" ? "Ilmainen" : "Free") : priceInput,
      start_date: startDate,
      end_date: endDate,
      event_link: getFormString(formData, "event_link"),
      title: {
        fi: titleFiInput.trim(),
        en: titleEnInput.trim(),
      },
      location: {
        fi: locationFiInput.trim(),
        en: locationEnInput.trim(),
      },
      latitude,
      longitude,
      description: {
        fi: getFormString(formData, "description_fi"),
        en: getFormString(formData, "description_en"),
      },
      recaptchaToken,
    };

    try {
      await axios.post(API_ENDPOINTS.SUBMIT_EVENT, payload);

      form.reset();
      if (RECAPTCHA_SITE_KEY) {
        recaptchaRef.current?.reset();
      }
      setLocationFiInput("");
      setLocationEnInput("");
      setLocationSearchInput("");
      setTitleFiInput("");
      setTitleEnInput("");
      setTitleFiBlurred(false);
      setLatitudeInput("");
      setLongitudeInput("");
      setIsFree(false);
      setPriceInput("");
      setStatus("success");
      setMessage(t.success);
      setToastNotice({
        type: "success",
        title: t.addEventToast,
        description: t.success,
      });
      setIsOpen(false);
    } catch (error) {
      let errorMessage: string;
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.error?.message) {
          errorMessage = data.error.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        } else if (data) {
          errorMessage = JSON.stringify(data);
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = String(error);
      }
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
  }

  const bubbleText = lang === "fi" ? "Lisää tapahtuma" : "Add an event";
  const latitudeValue = parseOptionalCoordinate(latitudeInput);
  const longitudeValue = parseOptionalCoordinate(longitudeInput);
  const mapLatitude = Number.isFinite(latitudeValue) ? (latitudeValue as number) : undefined;
  const mapLongitude = Number.isFinite(longitudeValue) ? (longitudeValue as number) : undefined;
  const titleDatalistId = `event-title-suggestions-${lang}`;
  const showEnglishTitle = titleFiBlurred || titleFiInput.trim().length > 0;

  return (
    <>
      {toastNotice &&
        createPortal(
          <ToastContainer $type={toastNotice.type}>
            <ToastHeader>
              <div>
                <ToastTitle>{toastNotice.title}</ToastTitle>
                <ToastDescription>{toastNotice.description}</ToastDescription>
              </div>
              <button
                type="button"
                aria-label={lang === "fi" ? "Sulje ilmoitus" : "Close notification"}
                style={{
                  borderRadius: "6px",
                  padding: "0.25rem",
                  color: "rgba(255,255,255,0.9)",
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setToastNotice(null);
                }}
              >
                ×
              </button>
            </ToastHeader>
          </ToastContainer>
          ,
          document.body,
        )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <section style={{ marginTop: "2rem", maxWidth: "760px" }}>
          <DialogTrigger asChild>
            <Button
              type="button"
              style={{
                borderRadius: "999px",
                padding: "1rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 700,
                background: "#0149bc",
                color: "#ffffff",
              }}
            >
              {bubbleText}
            </Button>
          </DialogTrigger>
        </section>

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
            background: "#fff",
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
                void onSubmit(event);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <section id="section-title">
                <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
                  <TextInput
                    id="title_fi"
                    name="title_fi"
                    label={t.titleFi}
                    requiredText={t.required}
                    hint={t.titleFiHint}
                    list={titleDatalistId}
                    value={titleFiInput}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setTitleFiInput(nextValue);

                      const match = titleSuggestions.find(
                        (item) => item.fi === nextValue
                      );

                      if (match) {
                        setTitleEnInput(match.en || "");
                      }
                    }}
                    onBlur={() => {
                      setTitleFiBlurred(true);
                    }}
                    required
                  />
                  <datalist id={titleDatalistId}>
                    {titleSuggestions.map((item) => (
                      <option key={`${item.fi}-${item.en}`} value={item.fi} />
                    ))}
                  </datalist>

                  {showEnglishTitle && (
                    <TextInput
                      id="title_en"
                      name="title_en"
                      label={t.titleEn}
                      requiredText={t.required}
                      value={titleEnInput}
                      onChange={(event) => {
                        setTitleEnInput(event.target.value);
                      }}
                      required
                    />
                  )}
                </FieldGroup>
              </section>

              <section id="section-time">
                <FieldGroup>
                  <div id="time-range" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", }}>
                    <TextInput
                      id="start_date"
                      name="start_date"
                      type="datetime-local"
                      label={t.start}
                      requiredText={t.required}
                      required
                      style={{ width: "max-content" }}
                    />
                    <TextInput
                      id="end_date"
                      name="end_date"
                      type="datetime-local"
                      label={t.end}
                      style={{ width: "max-content" }}
                    />
                  </div>
                  <div aria-hidden="true" />
                </FieldGroup>
              </section>

              <section id="section-organizer">
                <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
                  <TextInput
                    id="organizer_name"
                    name="organizer_name"
                    label={t.organizer}
                    requiredText={t.required}
                    required
                  />
                  <TextInput
                    id="event_link"
                    name="event_link"
                    type="url"
                    label={t.link}
                  />
                </FieldGroup>

                <FieldGroup style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
                  <HStack gap={4} align="flex-end" wrap="wrap">
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="#0f172a" mb={1}>
                        {t.price}
                      </Text>
                      <HStack gap={4} height="40px">
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                          <input
                            type="radio"
                            name="pricing_type"
                            value="free"
                            checked={isFree}
                            onChange={() => setIsFree(true)}
                          />
                          {t.free}
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                          <input
                            type="radio"
                            name="pricing_type"
                            value="paid"
                            checked={!isFree}
                            onChange={() => setIsFree(false)}
                          />
                          {t.paid}
                        </label>
                      </HStack>
                    </Box>

                    {!isFree && (
                      <Box style={{ width: "160px" }}>
                        <InputGroup
                          key="price-group"
                          endElement={
                            <Box mr={2} color="gray.500">
                              <FaEuroSign />
                            </Box>
                          }
                          flex="1"
                        >
                          <ChakraInput
                            id="price"
                            name="price"
                            placeholder={t.price}
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            size="sm"
                            h="38px"
                            borderRadius="6px"
                          />
                        </InputGroup>
                      </Box>
                    )}
                  </HStack>
                </FieldGroup>
              </section>

              <section id="section-location" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
                  <Box position="relative">
                    <TextInput
                      id="location_search"
                      label={t.locationAutocomplete}
                      value={locationSearchInput}
                      onChange={(event) => {
                        setLocationSearchInput(event.target.value);
                      }}
                      autoComplete="off"
                    />
                    {locationSearchInput && (
                      <Box
                        position="absolute"
                        top="100%"
                        left="0"
                        right="0"
                        zIndex={10}
                        bg="white"
                        border="1px solid #e2e8f0"
                        borderRadius="md"
                        boxShadow="lg"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {locationSuggestions
                          .filter((item) => {
                            const label = lang === "fi" ? item.label_fi : item.label_en;
                            return label.toLowerCase().includes(locationSearchInput.toLowerCase());
                          })
                          .map((item) => {
                            const label = lang === "fi" ? item.label_fi : item.label_en;
                            return (
                              <Box
                                key={item.documentId}
                                p={2}
                                _hover={{ bg: "gray.100", cursor: "pointer" }}
                                onClick={() => {
                                  setLocationSearchInput(label);
                                  setLocationFiInput(item.label_fi);
                                  setLocationEnInput(item.label_en);
                                  if (item.latitude !== null && item.longitude !== null) {
                                    setLatitudeInput(formatCoordinate(item.latitude));
                                    setLongitudeInput(formatCoordinate(item.longitude));
                                  }
                                }}
                              >
                                {label}
                              </Box>
                            );
                          })}
                      </Box>
                    )}
                  </Box>
                </FieldGroup>

                <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
                  <TextInput
                    id="location_fi"
                    name="location_fi"
                    label={t.locationFi}
                    value={locationFiInput}
                    onChange={(event) => {
                      setLocationFiInput(event.target.value);
                    }}
                  />
                  <TextInput
                    id="location_en"
                    name="location_en"
                    label={t.locationEn}
                    value={locationEnInput}
                    onChange={(event) => {
                      setLocationEnInput(event.target.value);
                    }}
                  />
                </FieldGroup>

                {/* Map section */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", margin: 0, marginBottom: "0.75rem" }}>
                    {t.mapLocationTitle}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#475569", margin: 0, marginBottom: "0.75rem" }}>{t.mapLocationHint}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ overflow: "hidden", borderRadius: "6px", border: "1px solid #e2e8f0", width: "100%" }}>
                      <LeafletLocationMap
                        latitude={mapLatitude}
                        longitude={mapLongitude}
                        onSelect={(lat, lon) => {
                          setLatitudeInput(formatCoordinate(lat));
                          setLongitudeInput(formatCoordinate(lon));
                        }}
                        zoom={13}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.25rem 0.5rem", background: "#f8fafc", borderRadius: "6px", fontSize: "0.875rem" }}>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <Text fontSize="sm" color="gray.700" m={0}>
                          <strong>{t.latitude}:</strong> {latitudeInput || "-"}
                        </Text>
                        <Text fontSize="sm" color="gray.700" m={0}>
                          <strong>{t.longitude}:</strong> {longitudeInput || "-"}
                        </Text>
                      </div>
                      {(latitudeInput || longitudeInput) && (
                        <ChakraButton
                          type="button"
                          variant="surface"
                          size="xs"
                          colorPalette="red"
                          height="20px"
                          padding="0 6px"
                          onClick={() => {
                            setLatitudeInput("");
                            setLongitudeInput("");
                          }}
                        >
                          {t.clearCoordinates}
                        </ChakraButton>
                      )}
                    </div>
                  </div>
                  <input type="hidden" name="latitude" value={latitudeInput} />
                  <input type="hidden" name="longitude" value={longitudeInput} />
                </div>
              </section>

              <section id="section-details">
                <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
                  <TextareaInput
                    id="description_fi"
                    name="description_fi"
                    label={t.descriptionFi}
                    rows={4}
                  />
                  <TextareaInput
                    id="description_en"
                    name="description_en"
                    label={t.descriptionEn}
                    rows={4}
                  />
                </FieldGroup>
              </section>

              {RECAPTCHA_SITE_KEY && (
                <div>
                  <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} />
                </div>
              )}

              <p style={{ fontSize: "0.875rem", color: "#475569", margin: "0 0 1rem 0" }}>{t.adminReviewNote}</p>

              <section id="section-submit" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", padding: "1rem 0" }}>
                {message && <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155", margin: 0, background: "rgba(255,255,255,0.8)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>{message}</p>}

                <PopoverRoot open={isPopoverOpen} onOpenChange={(e) => setIsPopoverOpen(e.open)}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      disabled={status === "submitting"}
                      onClick={() => setIsPopoverOpen(true)}
                      style={{ background: "#0149bc", color: "#ffffff", height: "2.5rem", borderRadius: "8px", padding: "0 1.5rem", fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      {status === "submitting" ? t.sending : t.submit}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent style={{ borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
                    <PopoverArrow />
                    <PopoverHeader border="0" padding="0" marginBottom="0.5rem">
                      <PopoverTitle fontWeight="700" color="#0f172a">{t.confirmTitle}</PopoverTitle>
                    </PopoverHeader>
                    <PopoverBody padding="0" marginBottom="1rem" fontSize="0.875rem" color="#475569">
                      {t.confirmQuestion}
                    </PopoverBody>
                    <PopoverFooter border="0" padding="0" display="flex" justifyContent="flex-end" gap="0.5rem">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsPopoverOpen(false)}
                        style={{ color: "#64748b" }}
                      >
                        {t.cancel}
                      </Button>
                      <Button
                        size="sm"
                        style={{ background: "#0149bc", color: "#fff" }}
                        onClick={() => {
                          void handleConfirmSubmit();
                        }}
                      >
                        {t.confirmAction}
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </PopoverRoot>
              </section>
            </form>
          </div>

          <AsideNavigation>
            <div style={{ padding: "0.25rem" }}>
              <p style={{ marginBottom: "0.75rem", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#94a3b8" }}>
                {t.navigation}
              </p>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {sectionItems.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <NavButton
                      key={section.id}
                      type="button"
                      $active={isActive}
                      onClick={() => {
                        scrollToSection(section.id);
                      }}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {section.label}
                    </NavButton>
                  );
                })}
              </nav>
            </div>
          </AsideNavigation>
        </DialogContent>
      </Dialog>
    </>
  );
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
  line-height: 1.25;
  margin: 0;
`;

const ToastDescription = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.35;
  opacity: 0.95;
`;

const AsideNavigation = styled.aside`
  position: absolute;
  left: 100%;
  top: 92px;
  margin-left: 1rem;
  width: 220px;
  display: none;

  @media (min-width: 1280px) {
    display: block;
  }
`;

const NavButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  border: 0;
  background: transparent;
  padding: 0.25rem 0;
  text-align: left;
  font-size: 0.875rem;
  color: ${props => props.$active ? "#0f172a" : "#64748b"};
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: currentColor;
    display: ${props => props.$active ? "block" : "none"};
  }
`;
