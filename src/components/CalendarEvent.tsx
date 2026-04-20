"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { fi, enUS } from "date-fns/locale";
import { Language } from "../utils";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  Box,
  Text,
  Heading,
  Stack,
  HStack,
  Link,
  Badge,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { EventDetailedCard } from "./EventDetailedCard";

interface EventProps {
  title: Record<Language, string>;
  description: Record<Language, string> | null;
  hide_location: boolean;
  location: Record<Language, string> | null;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string | null;
  event_link: string;
  language: Language;
  organizer_name: string | null;
  price: string | null;
  status: "active" | "past" | "upcoming";
}

const CalendarEvent: React.FC<EventProps> = (props) => {
  const {
    title,
    start_date,
    language,
    location,
    hide_location,
    organizer_name,
    latitude,
    longitude,
    status,
  } = props;

  const parsedDate = start_date ? parseISO(start_date) : null;
  const dateStr = parsedDate
    ? format(parsedDate, "do MMMM yyyy", {
      locale: language === "fi" ? fi : enUS,
    })
    : "";
  const timeStr = parsedDate ? format(parsedDate, "HH:mm") : "";

  const statusLabel = status === "active"
    ? (language === "fi" ? "Käynnissä" : "Active")
    : status === "past"
      ? (language === "fi" ? "Päättynyt" : "Past")
      : null;

  const isPast = status === "past";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card.Root
          variant="elevated"
          overflow="hidden"
          transition="all 0.2s"
          _hover={{ transform: isPast ? "none" : "translateY(-4px)", shadow: "sm", borderColor: isPast ? "gray.300" : "blue.500", cursor: isPast ? "default" : "pointer" }}
          borderLeftWidth="4px"
          borderLeftColor={isPast ? "gray.400" : "blue.600"}
          height="100%"
          opacity={isPast ? 0.7 : 1}
        >
          <Card.Body p={4}>
            <Stack gap={0}>
              {statusLabel && (
                <HStack mb={1} justify="flex-start">
                  <Badge
                    colorPalette={isPast ? "gray" : "green"}
                    variant="solid"
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="capitalize"
                    px={2}
                    py={0.5}
                  >
                    {statusLabel}
                  </Badge>
                </HStack>
              )}
              <Box minH="3.1rem">
                <Box css={{ containerType: "inline-size" }} w="full">
                  <Heading
                    fontWeight="bold"
                    lineHeight="1.4"
                    color="gray.800"
                    m={0}
                    lineClamp={2}
                    fontSize={`clamp(0.85rem, calc(100cqi / (${Math.max(title[language].length, 1)} * 0.55)), 1.1rem)`}
                  >
                    {title[language]}
                  </Heading>
                </Box>
              </Box>

              <Stack gap={1}>
                {dateStr && (
                  <HStack gap={2} align="center">
                    <Box color="blue.600">
                      <FaCalendarAlt size={14} />
                    </Box>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium" m={0}>
                      {dateStr}
                    </Text>
                  </HStack>
                )}
                {timeStr && (
                  <HStack gap={2} align="center">
                    <Box color="blue.600">
                      <FaClock size={14} />
                    </Box>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium" m={0}>
                      {timeStr}
                    </Text>
                  </HStack>
                )}
                {!hide_location && location && (
                  <HStack gap={2} align="start">
                    <Box color="blue.600" mt={0.5}>
                      <FaMapMarkerAlt size={14} />
                    </Box>
                    {latitude != null && longitude != null ? (
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize="xs"
                        color="blue.600"
                        fontWeight="medium"
                        m={0}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {location[language]}
                      </Link>
                    ) : (
                      <Text fontSize="xs" color="gray.600" fontWeight="medium" m={0}>
                        {location[language]}
                      </Text>
                    )}
                  </HStack>
                )}
                {organizer_name && (
                  <HStack gap={2} align="start">
                    <Box color="blue.600" mt={0.5}>
                      <FaUsers size={14} />
                    </Box>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium" m={0}>
                      {organizer_name}
                    </Text>
                  </HStack>
                )}
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </DialogTrigger>

      <EventDetailedCard {...props} />
    </Dialog>
  );
};

export default CalendarEvent;
