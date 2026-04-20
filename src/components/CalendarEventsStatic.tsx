"use client";

import { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Language } from "../utils";
import CalendarEventMinimal from "./CalendarEventMinimal";
import { parseISO } from "date-fns";

interface CalendarEventData {
  documentId: string;
  start_date: string;
  end_date: string | null;
  title: { fi: string; en: string };
  location: { fi: string; en: string } | null;
  description: { fi: string; en: string } | null;
  organizer_name: string | null;
  price: string | null;
  event_link: string;
  hide_location: boolean;
  location_coordinates: { lat: number; lng: number } | null;
  hidden: boolean;
}

interface CalendarEventProps extends CalendarEventData {
  status: "active" | "past" | "upcoming";
}

interface CalendarEventsStaticProps {
  language: Language;
  events: CalendarEventData[];
  showAll?: boolean;
  maxEvents?: number;
}

export default function CalendarEventsStatic({
  language,
  events,
  showAll = false,
  maxEvents = 5,
}: CalendarEventsStaticProps) {
  const [filtered] = useState<CalendarEventProps[]>(() => {
    const now = new Date();
    const upcoming = events
      .filter((event) => {
        const start = parseISO(event.start_date);
        const end = event.end_date ? parseISO(event.end_date) : start;
        return end >= now;
      })
      .map((event): CalendarEventProps => {
        const now = new Date();
        const start = parseISO(event.start_date);
        const end = event.end_date ? parseISO(event.end_date) : start;
        const status: CalendarEventProps["status"] =
          now >= start && now <= end
            ? "active"
            : now < start
              ? "upcoming"
              : "past";
        return { ...event, status };
      });
    return showAll ? upcoming : upcoming.slice(0, maxEvents);
  });

  if (filtered.length === 0) {
    return (
      <div style={{ color: "#64748b", fontStyle: "italic", margin: "1rem 0" }}>
        {language === "fi"
          ? "Ei tulevia tapahtumia tällä hetkellä."
          : "No upcoming events at the moment."}
      </div>
    );
  }

  return (
    <Box my={6}>
      <Stack gap={2} w="21rem" ml="auto">
        {filtered.map((evt) => (
          <CalendarEventMinimal
            key={evt.documentId}
            language={language}
            title={evt.title}
            description={evt.description}
            organizer_name={evt.organizer_name}
            price={evt.price}
            hide_location={evt.hide_location}
            location={evt.location}
            latitude={evt.location_coordinates?.lat || null}
            longitude={evt.location_coordinates?.lng || null}
            start_date={evt.start_date}
            end_date={evt.end_date}
            event_link={evt.event_link}
            status={evt.status}
          />
        ))}
      </Stack>
    </Box>
  );
}
