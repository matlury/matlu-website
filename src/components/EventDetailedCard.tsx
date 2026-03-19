"use client";

import React from "react";
import dynamic from "next/dynamic";
import { parseISO, format } from "date-fns";
import { fi, enUS } from "date-fns/locale";
import { Box, Text, Link, Stack, HStack } from "@chakra-ui/react";
import { FaMapMarkerAlt, FaMapPin, FaEuroSign, FaUsers } from "react-icons/fa";
import { Language } from "../utils";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

const LeafletLocationMap = dynamic(() => import("./LeafletLocationMap"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                height: "240px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                background: "#f1f5f9",
            }}
        />
    ),
});

interface EventDetailedCardProps {
    title: Record<Language, string>;
    description: Record<Language, string> | null;
    hide_location: boolean;
    location: Record<Language, string> | null;
    latitude: number | null;
    longitude: number | null;
    start_date: string;
    event_link: string;
    language: Language;
    organizer_name: string | null;
    price: string | null;
}

export const EventDetailedCard: React.FC<EventDetailedCardProps> = ({
    title,
    description,
    start_date,
    event_link,
    language,
    location,
    latitude,
    longitude,
    hide_location,
    organizer_name,
    price,
}) => {
    const hasCoordinates =
        typeof latitude === "number" &&
        Number.isFinite(latitude) &&
        typeof longitude === "number" &&
        Number.isFinite(longitude);

    const parsedDate = start_date ? parseISO(start_date) : null;
    const dateStr = parsedDate
        ? format(parsedDate, "do MMMM yyyy", {
            locale: language === "fi" ? fi : enUS,
        })
        : "";
    const timeStr = parsedDate ? format(parsedDate, "HH:mm") : "";

    return (
        <DialogContent
            showCloseButton={false}
            style={{
                width: "100%",
                maxWidth: "40rem",
                padding: 0,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                background: "#fff",
            }}
        >
            <DialogHeader
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.75rem 1.5rem",
                }}
            >
                <Box>
                    <DialogTitle m={0} style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
                        {title[language]}
                    </DialogTitle>
                    <Stack gap={0} mt={0.5}>
                        {dateStr && (
                            <Text fontSize="xs" color="gray.500" fontWeight="semibold" m={0}>
                                {dateStr} {timeStr}
                            </Text>
                        )}
                        {organizer_name && (
                            <HStack gap={2} mt={1} align="flex-start">
                                <Box color="blue.600" mt={0.5}>
                                    <FaUsers size={12} />
                                </Box>
                                <Text fontSize="xs" color="gray.500" fontWeight="bold" m={0}>
                                    {organizer_name}
                                </Text>
                            </HStack>
                        )}
                    </Stack>
                </Box>
                <DialogClose asChild>
                    <button
                        type="button"
                        aria-label={language === "fi" ? "Sulje dialogi" : "Close dialog"}
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
                            lineHeight: 1,
                        }}
                    >
                        <span style={{ fontSize: "1.875rem", lineHeight: 1 }}>&times;</span>
                    </button>
                </DialogClose>
            </DialogHeader>

            <Box p={4} pt={0}>
                <Stack gap={4}>
                    <Box borderBottom="1px solid #e2e8f0" />

                    {description?.[language] && (
                        <Box>
                            <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                                {description[language]}
                            </Text>
                        </Box>
                    )}

                    <Stack gap={3}>
                        {price && (
                            <HStack gap={3} align="start">
                                <Box color="blue.600" mt={1}>
                                    <FaEuroSign size={16} />
                                </Box>
                                <Box>
                                    <Text fontSize="sm" fontWeight="bold" color="gray.800" m={0}>
                                        {language === "fi" ? "Pääsymaksu" : "Admission"}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" m={0}>
                                        {price}
                                    </Text>
                                </Box>
                            </HStack>
                        )}

                        {!hide_location && location && (
                            <HStack gap={3} align="start">
                                <Box color="blue.600" mt={1}>
                                    <FaMapMarkerAlt size={16} />
                                </Box>
                                <Box>
                                    <Text fontSize="sm" fontWeight="bold" color="gray.800" m={0}>
                                        {language === "fi" ? "Sijainti" : "Location"}
                                    </Text>
                                    {latitude != null && longitude != null ? (
                                        <Link
                                            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fontSize="sm"
                                            color="blue.600"
                                            m={0}
                                            _hover={{ textDecoration: "underline" }}
                                        >
                                            {location[language]}
                                        </Link>
                                    ) : (
                                        <Text fontSize="sm" color="gray.600" m={0}>
                                            {location[language]}
                                        </Text>
                                    )}
                                </Box>
                            </HStack>
                        )}

                        {event_link && (
                            <HStack gap={3} align="center">
                                <Box color="blue.600">
                                    <FaMapPin size={16} />
                                </Box>
                                <Link
                                    href={event_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    fontSize="sm"
                                    fontWeight="bold"
                                    color="blue.600"
                                    _hover={{ textDecoration: "underline" }}
                                >
                                    {language === "fi" ? "Lue lisää" : "Read more"}
                                </Link>
                            </HStack>
                        )}
                    </Stack>

                    {!hide_location && hasCoordinates && (
                        <Box borderRadius="lg" overflow="hidden" border="1px solid #e2e8f0">
                            <LeafletLocationMap
                                latitude={latitude ?? undefined}
                                longitude={longitude ?? undefined}
                                zoom={14}
                                height={240}
                            />
                        </Box>
                    )}
                </Stack>
            </Box>
        </DialogContent>
    );
};
