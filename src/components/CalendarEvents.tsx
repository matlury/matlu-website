"use client";

import { useEffect, useState } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { Language } from "../utils";
import CalendarEvent from "./CalendarEvent";
import { compareAsc, isAfter, isBefore, parseISO } from "date-fns";
import { fetchGraphQLClient } from "../lib/strapi";
import { gql } from "@apollo/client";

interface CalendarEventsProps {
  language: Language;
  showAll?: boolean;
}

interface CalendarEventsQueryResult {
  calendarEvents: Array<{
    documentId: string;
    event_link: string;
    hide_location: boolean;
    location_coordinates: {
      lat: number;
      lng: number;
    } | null;
    start_date: string;
    end_date: string | null;
    title: {
      fi: string;
      en: string;
    };
    location: {
      en: string;
      fi: string;
    } | null;
    description: {
      en: string;
      fi: string;
    } | null;
    organizer_name: string | null;
    price: string | null;
    hidden: boolean;
  }>;
  eventLocations: Array<{
    documentId: string;
    label_fi: string;
    label_en: string;
    location_coordinates: {
      lat: number;
      lng: number;
    } | null;
  }>;
}

const CALENDAR_EVENTS_QUERY = gql`
  query CalendarEventsQuery {
    calendarEvents(filters: { hidden: { eq: false } }, sort: "start_date:asc") {
      documentId
      event_link
      hide_location
      location_coordinates
      start_date
      end_date
      title {
        fi
        en
      }
      location {
        fi
        en
      }
      description {
        fi
        en
      }
      organizer_name
      price
      hidden
    }
    eventLocations {
      documentId
      label_fi
      label_en
      location_coordinates
    }
  }
`;

interface EventData {
  id: string;
  documentId: string;
  event_link: string;
  hide_location: boolean;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string | null;
  title: { fi: string; en: string };
  location: { en: string; fi: string } | null;
  description: { en: string; fi: string } | null;
  organizer_name: string | null;
  price: string | null;
  hidden: boolean;
  status: "active" | "past" | "upcoming";
}

export default function CalendarEvents({
  language,
  showAll = false,
}: CalendarEventsProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetchGraphQLClient<CalendarEventsQueryResult>(
          CALENDAR_EVENTS_QUERY,
        );
        const data = response.data;

        if (!data?.calendarEvents) {
          setError(true);
          return;
        }

        const allEvents = data.calendarEvents.map((node) => ({
          id: node.documentId,
          documentId: node.documentId,
          event_link: node.event_link,
          hide_location: node.hide_location,
          latitude: node.location_coordinates?.lat || null,
          longitude: node.location_coordinates?.lng || null,
          start_date: node.start_date,
          end_date: node.end_date || null,
          title: node.title,
          location: node.location,
          description: node.description,
          organizer_name: node.organizer_name,
          price: node.price,
          hidden: node.hidden,
        }));

        const now = new Date();

        const withStatus = allEvents.map((event) => {
          const start = parseISO(event.start_date);
          const end = event.end_date ? parseISO(event.end_date) : null;

          let status: "active" | "past" | "upcoming";
          if (isBefore(now, start)) {
            status = "upcoming";
          } else if (end && isAfter(now, end)) {
            status = "past";
          } else {
            status = "active";
          }

          return { ...event, status };
        });

        const activeAndUpcoming = withStatus.filter(
          (e) => e.status === "active" || e.status === "upcoming",
        );
        const pastEvents = withStatus.filter((e) => e.status === "past");

        if (showAll) {
          const sorted = [
            ...activeAndUpcoming.sort((a, b) =>
              compareAsc(parseISO(a.start_date), parseISO(b.start_date)),
            ),
            ...pastEvents.sort((a, b) =>
              compareAsc(parseISO(b.start_date), parseISO(a.start_date)),
            ),
          ];
          setEvents(sorted);
        } else {
          setEvents(activeAndUpcoming.slice(0, 2));
        }
      } catch (err) {
        console.error("Failed to load calendar events", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [showAll]);

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} my={6}>
        <div />
        <div />
      </SimpleGrid>
    );
  }

  if (error) {
    return (
      <div style={{ color: "#64748b", fontStyle: "italic", margin: "1rem 0" }}>
        {language === "fi"
          ? "Tapahtumien lataus epäonnistui."
          : "Failed to load events."}
      </div>
    );
  }

  if (events.length === 0) {
    const hasAnyEvents = !loading && !error;
    return (
      <div style={{ color: "#64748b", fontStyle: "italic", margin: "1rem 0" }}>
        {language === "fi"
          ? (hasAnyEvents
              ? "Ei tulevia tai käynnissä olevia tapahtumia tällä hetkellä."
              : "Ei tulevia tapahtumia tällä hetkellä.")
          : (hasAnyEvents
              ? "No upcoming or active events at the moment."
              : "No upcoming events at the moment.")}
      </div>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} my={6}>
      {events.map((evt) => (
        <CalendarEvent
          key={evt.documentId}
          language={language}
          title={evt.title}
          description={evt.description}
          organizer_name={evt.organizer_name}
          price={evt.price}
          hide_location={evt.hide_location}
          location={evt.location}
          latitude={evt.latitude}
          longitude={evt.longitude}
          start_date={evt.start_date}
          end_date={evt.end_date}
          event_link={evt.event_link}
          status={evt.status}
        />
      ))}
    </SimpleGrid>
  );
}