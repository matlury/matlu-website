"use client";

import React from "react";
import { Box, HStack, InputGroup, Input as ChakraInput, Text } from "@chakra-ui/react";
import { FaEuroSign } from "react-icons/fa";
import { FieldGroup } from "@/components/ui/field";
import { FieldInput } from "./FieldInput";
import type { TEXT } from "@/locales/event-request";

interface OrganizerSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  t: (typeof TEXT)["en"] | (typeof TEXT)["fi"];
}

export function OrganizerSection({ form, t }: OrganizerSectionProps) {
  return (
    <section id="section-organizer">
      <FieldGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
        <FieldInput form={form} name="organizer_name" label={t.organizer} required requiredText={t.required} />
        <FieldInput form={form} name="event_link" label={t.link} type="url" />
      </FieldGroup>

      <FieldGroup style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
        <HStack gap={4} align="flex-end" wrap="wrap">
          <form.Field name="pricing_type">
            {(field: { name: string; state: { value: string }; handleBlur: () => void; handleChange: (v: string) => void }) => (
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="#0f172a" mb={1}>
                  {t.price}
                </Text>
                <HStack gap={4} height="40px">
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                    <input
                      type="radio"
                      name={field.name}
                      value="free"
                      checked={field.state.value === "free"}
                      onChange={() => field.handleChange("free")}
                      onBlur={field.handleBlur}
                    />
                    {t.free}
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                    <input
                      type="radio"
                      name={field.name}
                      value="paid"
                      checked={field.state.value === "paid"}
                      onChange={() => field.handleChange("paid")}
                      onBlur={field.handleBlur}
                    />
                    {t.paid}
                  </label>
                </HStack>
              </Box>
            )}
          </form.Field>

          <form.Subscribe selector={(state: { values: { pricing_type: string } }) => [state.values.pricing_type]}>
            {([pricingType]: [string]) =>
              pricingType === "paid" && (
                <Box style={{ width: "160px" }}>
                  <form.Field name="price">
                    {(field: { name: string; state: { value: string }; handleBlur: () => void; handleChange: (v: string) => void }) => (
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
                          id={field.name}
                          placeholder={t.price}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          size="sm"
                          h="38px"
                          borderRadius="6px"
                        />
                      </InputGroup>
                    )}
                  </form.Field>
                </Box>
              )}
          </form.Subscribe>
        </HStack>
      </FieldGroup>
    </section>
  );
}
