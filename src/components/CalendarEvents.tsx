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
    start_date: string;
    title: {
      fi: string;
      en: string;
    };
    location: {
      en: string;
      fi: string;
    } | null;
    hidden: boolean;
  }>;
}

const CALENDAR_EVENTS_QUERY = gql`
  query CalendarEventsQuery {
    calendarEvents(filters: { hidden: { eq: false } }, sort: "start_date:asc") {
      documentId
      event_link
      hide_location
      start_date
      title {
        fi
        en
      }
      location {
        fi
        en
      }
      hidden
    }
  }
`;

const CalendarEvents = async ({
  language,
  showAll = false,
}: CalendarEventsProps) => {
  const { data } = await fetchGraphQL<CalendarEventsQueryResult>(
    CALENDAR_EVENTS_QUERY,
  );

  if (!data?.calendarEvents) return <div>{language === "fi" ? "Ei tulevia tapahtumia." : "No upcoming events."}</div>;

  const allEvents = data.calendarEvents.map((node) => ({
    id: node.documentId,
    documentId: node.documentId,
    event_link: node.event_link,
    hide_location: node.hide_location,
    start_date: node.start_date,
    title: node.title,
    location: node.location,
  }));

  let events = allEvents.filter(
    (event) => compareAsc(parseISO(event.start_date), new Date()) >= 0,
  );

  if (!showAll) {
    events = events.slice(0, 2);
  }

  return (
    <div>
      {events.length > 0 &&
        events.map((evt) => (
          <CalendarEvent
            key={evt.documentId}
            language={language}
            title={evt.title}
            hide_location={evt.hide_location}
            location={evt.location}
            start_date={evt.start_date}
            event_link={evt.event_link}
          />
        ))}
      {events.length === 0 &&
        (language === "fi" ? "Ei tulevia tapahtumia." : "No upcoming events.")}
    </div>
  );
};

export default CalendarEvents;
