"use client";

import { useEffect, useState } from "react";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";
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
  const [activeAndUpcoming, setActiveAndUpcoming] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
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

        const upcoming = withStatus.filter(
          (e) => e.status === "active" || e.status === "upcoming",
        ).sort((a, b) =>
          compareAsc(parseISO(a.start_date), parseISO(b.start_date)),
        );
        const past = withStatus.filter((e) => e.status === "past").sort((a, b) =>
          compareAsc(parseISO(b.start_date), parseISO(a.start_date)),
        );

        if (showAll) {
          setActiveAndUpcoming(upcoming);
          setPastEvents(past);
        } else {
          setActiveAndUpcoming(upcoming.slice(0, 2));
          setPastEvents([]);
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

  const sectionTitle = language === "fi" ? "Tulevat tapahtumat" : "Upcoming events";
  const pastSectionTitle = language === "fi" ? "Päättyneet tapahtumat" : "Past events";

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

  const hasNoEvents = activeAndUpcoming.length === 0 && pastEvents.length === 0;

  if (hasNoEvents) {
    return (
      <div style={{ color: "#64748b", fontStyle: "italic", margin: "1rem 0" }}>
        {language === "fi"
          ? "Ei tapahtumia tällä hetkellä."
          : "No events at the moment."}
      </div>
    );
  }

  const renderEvents = (events: EventData[]) => (
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

  if (showAll) {
    return (
      <Box>
        {activeAndUpcoming.length > 0 && (
          <Box>
            <Text
              as="h2"
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              mt={6}
              mb={2}
            >
              {sectionTitle}
            </Text>
            {renderEvents(activeAndUpcoming)}
          </Box>
        )}
        {pastEvents.length > 0 && (
          <Box>
            <Text
              as="h2"
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              mt={6}
              mb={2}
            >
              {pastSectionTitle}
            </Text>
            {renderEvents(pastEvents)}
          </Box>
        )}
      </Box>
    );
  }

  return renderEvents(activeAndUpcoming);
}