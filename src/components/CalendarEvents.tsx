import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Language, CalendarEventsQuery } from "../utils";
import CalendarEvent from "./CalendarEvent";
import { compareAsc, parseISO } from "date-fns/esm";

interface CalendarEventsProps {
  language: Language;
  showAll?: boolean;
}

const CalendarEvents: React.FC<CalendarEventsProps> = ({
  language,
  showAll = false,
}) => {
  const data: CalendarEventsQuery = useStaticQuery(graphql`
    query CalendarEventsQuery {
      allStrapiCalendarEvent(
        sort: { start_date: ASC }
        filter: { hidden: { eq: false } }
      ) {
        nodes {
          id
          documentId
          event_link
          hide_location
          start_date
          title {
            fi
            en
          }
          location {
            en
            fi
          }
        }
      }
    }
  `);
  let events = [
    ...data.allStrapiCalendarEvent.nodes.filter(
      (event) => compareAsc(parseISO(event.start_date), new Date()) >= 0,
    ),
  ];
  if (!showAll) {
    events = [...events.slice(0, 2)];
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
