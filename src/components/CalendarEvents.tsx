import { SimpleGrid } from "@chakra-ui/react";
import { Language } from "../utils";
import CalendarEvent from "./CalendarEvent";
import { compareAsc, parseISO } from "date-fns";
import { fetchGraphQL } from "../lib/strapi";
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

const CalendarEvents = async ({
  language,
  showAll = false,
}: CalendarEventsProps) => {
  let data;
  try {
    const response = await fetchGraphQL<CalendarEventsQueryResult>(
      CALENDAR_EVENTS_QUERY,
    );
    data = response.data;
  } catch (err) {
    console.error("Failed to load calendar events", err);
  }

  if (!data?.calendarEvents)
    return (
      <div style={{ color: "#64748b", fontStyle: "italic", margin: "1rem 0" }}>
        {language === "fi" ? "Ei tulevia tapahtumia tällä hetkellä." : "No upcoming events at the moment."}
      </div>
    );

  const allEvents = data.calendarEvents.map((node) => ({
    id: node.documentId,
    documentId: node.documentId,
    event_link: node.event_link,
    hide_location: node.hide_location,
    latitude: node.location_coordinates?.lat || null,
    longitude: node.location_coordinates?.lng || null,
    start_date: node.start_date,
    title: node.title,
    location: node.location,
    description: node.description,
    organizer_name: node.organizer_name,
    price: node.price,
    hidden: node.hidden,
  }));

  let events = allEvents.filter(
    (event) => compareAsc(parseISO(event.start_date), new Date()) >= 0,
  );

  if (!showAll) {
    events = events.slice(0, 2);
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} my={6}>
      {events.length > 0 &&
        events.map((evt) => (
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
            event_link={evt.event_link}
          />
        ))}
      {events.length === 0 &&
        (language === "fi" ? "Ei tulevia tapahtumia." : "No upcoming events.")}
    </SimpleGrid>
  );
};

export default CalendarEvents;
