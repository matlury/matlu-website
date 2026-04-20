"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { fi, enUS } from "date-fns/locale";
import { Language } from "../utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Box,
  Text,
  Heading,
  Stack,
  HStack,
  Badge,
} from "@chakra-ui/react";
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

const CalendarEventMinimal: React.FC<EventProps> = (props) => {
  const {
    title,
    start_date,
    language,
    status,
  } = props;

  const parsedDate = start_date ? parseISO(start_date) : null;
  const dateTimeStr = parsedDate
    ? format(parsedDate, "dd.MM.yyyy HH:mm", {
      locale: language === "fi" ? fi : enUS,
    })
    : "";

  const statusLabel = status === "active"
    ? (language === "fi" ? "Käynnissä" : "Active")
    : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Box
          p={3}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          transition="all 0.15s"
          _hover={{ borderColor: "blue.500", bg: "blue.50", cursor: "pointer" }}
        >
          <Stack gap={1}>
            <HStack justify="space-between" align="flex-start">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="blue.700"
                m={0}
                fontFamily="mono"
              >
                {dateTimeStr}
              </Text>
              {statusLabel && (
                <Badge
                  colorPalette="green"
                  variant="solid"
                  fontSize="xs"
                  fontWeight="bold"
                  px={2}
                  py={0.5}
                >
                  {statusLabel}
                </Badge>
              )}
            </HStack>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="semibold"
              color="gray.800"
              m={0}
              lineClamp={1}
            >
              {title[language]}
            </Heading>
          </Stack>
        </Box>
      </DialogTrigger>

      <EventDetailedCard {...props} />
    </Dialog>
  );
};

export default CalendarEventMinimal;
