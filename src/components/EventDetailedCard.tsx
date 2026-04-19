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
                maxHeight: "calc(100vh - 4rem)",
                display: "flex",
                flexDirection: "column",
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
                    padding: "1rem 1.5rem 0.2rem 1.5rem",
                    flexShrink: 0,
                    borderBottom: "1px solid #e2e8f0",
                }}
            >
                <Box>
                    <DialogTitle m={0} style={{ color: "#0f172a" }}>
                        {title[language]}
                    </DialogTitle>
                    {dateStr && (
                        <Text fontSize="sm" color="gray.500" fontWeight="semibold" m={0} mt={1}>
                            {dateStr} {timeStr}
                        </Text>
                    )}
                    <HStack gap={4} mt={2} wrap="wrap" align="center">
                        {organizer_name && (
                            <HStack gap={1.5} align="center">
                                <Box color="blue.600">
                                    <FaUsers size={14} />
                                </Box>
                                <Text fontSize="sm" color="gray.500" fontWeight="bold" m={0}>
                                    {organizer_name}
                                </Text>
                            </HStack>
                        )}
                        {price && (
                            <HStack gap={1.5} align="center">
                                <Box color="blue.600">
                                    <FaEuroSign size={14} />
                                </Box>
                                <Text fontSize="sm" color="gray.500" fontWeight="bold" m={0}>
                                    {price}
                                </Text>
                            </HStack>
                        )}
                        {!hide_location && location && (
                            <HStack gap={1.5} align="center">
                                <Box color="blue.600">
                                    <FaMapMarkerAlt size={14} />
                                </Box>
                                {latitude != null && longitude != null ? (
                                    <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fontSize="sm"
                                        color="blue.600"
                                        fontWeight="bold"
                                        m={0}
                                        _hover={{ textDecoration: "underline" }}
                                    >
                                        {location[language]}
                                    </Link>
                                ) : (
                                    <Text fontSize="sm" color="gray.500" fontWeight="bold" m={0}>
                                        {location[language]}
                                    </Text>
                                )}
                            </HStack>
                        )}
                    </HStack>
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
                        <span style={{ fontSize: "2rem", lineHeight: 1 }}>&times;</span>
                    </button>
                </DialogClose>
            </DialogHeader>

            <Box
                p={6}
                pt={4}
                overflowY="auto"
                css={{
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#f1f5f9",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#cbd5e1",
                        borderRadius: "3px",
                    },
                }}
            >
                <Stack gap={6}>

                    {description?.[language] && (
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800" m={0} mb={1}>
                                {language === "fi" ? "Kuvaus" : "Description"}
                            </Text>
                            <Text fontSize="var(--font-size-body)" lineHeight="var(--line-height-body)" color="gray.700" whiteSpace="pre-wrap">
                                {description[language]}
                            </Text>
                        </Box>
                    )}

                    <Stack gap={4}>
                        {event_link && (
                            <HStack gap={3} align="center">
                                <Box color="blue.600">
                                    <FaMapPin size={18} />
                                </Box>
                                <Link
                                    href={event_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    fontSize="var(--font-size-body)"
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
