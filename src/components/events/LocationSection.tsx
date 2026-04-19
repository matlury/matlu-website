"use client";

import dynamic from "next/dynamic";
import { Box, Text } from "@chakra-ui/react";
import { Language } from "@/utils";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/ui/TextInput";
import { FieldInput } from "./FieldInput";
import { getEventText } from "@/utils/event-locale";
import { formatCoordinate } from "@/utils/form-utils";

interface LocationSuggestion {
  documentId: string;
  label_fi: string;
  label_en: string;
  latitude: number | null;
  longitude: number | null;
}

const LeafletLocationMap = dynamic(() => import("../LeafletLocationMap"), {
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

interface LocationSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  lang: Language;
  locationSearchInput: string;
  setLocationSearchInput: (v: string) => void;
  locationSuggestions: LocationSuggestion[];
  mapLatitude: number | undefined;
  mapLongitude: number | undefined;
}

export function LocationSection({
  form,
  lang,
  locationSearchInput,
  setLocationSearchInput,
  locationSuggestions,
  mapLatitude,
  mapLongitude,
}: LocationSectionProps) {
  const t = getEventText(lang);

  return (
    <section id="section-location" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
        <Box position="relative">
          <TextInput
            id="location_search"
            label={t.locationAutocomplete}
            value={locationSearchInput}
            onChange={(event) => setLocationSearchInput(event.target.value)}
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
              border="1px solid"
              borderColor="border"
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
                        form.setFieldValue("location_fi", item.label_fi);
                        form.setFieldValue("location_en", item.label_en);
                        if (item.latitude !== null && item.longitude !== null) {
                          form.setFieldValue("latitude", formatCoordinate(item.latitude));
                          form.setFieldValue("longitude", formatCoordinate(item.longitude));
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
        <FieldInput form={form} name="location_fi" label={t.locationFi} />
        <FieldInput form={form} name="location_en" label={t.locationEn} />
      </FieldGroup>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", margin: 0, marginBottom: "0.75rem" }}>
          {t.mapLocationTitle}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#475569", margin: 0, marginBottom: "0.75rem" }}>{t.mapLocationHint}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ overflow: "hidden", borderRadius: "6px", border: "1px solid", borderColor: "border", width: "80%", marginRight: "auto" }}>
            <LeafletLocationMap
              latitude={mapLatitude}
              longitude={mapLongitude}
              onSelect={(lat: number, lon: number) => {
                form.setFieldValue("latitude", formatCoordinate(lat));
                form.setFieldValue("longitude", formatCoordinate(lon));
              }}
              zoom={13}
            />
          </div>
          <form.Subscribe selector={(state: { values: { latitude: string; longitude: string } }) => [state.values.latitude, state.values.longitude]}>
            {([latVal, lonVal]: [string, string]) => (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.25rem 0.5rem", background: "#f8fafc", borderRadius: "6px", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Text fontSize="sm" color="gray.700" m={0}>
                    <strong>{t.latitude}:</strong> {latVal || "-"}
                  </Text>
                  <Text fontSize="sm" color="gray.700" m={0}>
                    <strong>{t.longitude}:</strong> {lonVal || "-"}
                  </Text>
                </div>
                {(latVal || lonVal) && (
                  <button
                    type="button"
                    style={{
                      height: "20px",
                      padding: "0 6px",
                      fontSize: "0.75rem",
                      border: "1px solid",
                      borderColor: "red.300",
                      borderRadius: "4px",
                      background: "transparent",
                      color: "red.500",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      form.setFieldValue("latitude", "");
                      form.setFieldValue("longitude", "");
                    }}
                  >
                    {t.clearCoordinates}
                  </button>
                )}
              </div>
            )}
          </form.Subscribe>
        </div>
      </div>
    </section>
  );
}
