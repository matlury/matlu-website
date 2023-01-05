import React from "react";
import { format, parseISO } from "date-fns";
import { fi, enUS } from "date-fns/locale";
import { Language } from "../utils";
import styles from "./CalendarEvent.module.scss";
interface EventProps {
  title: Record<Language, string>;
  hide_location: boolean;
  location: Record<Language, string> | null;
  start_date: string;
  event_link: string;
  language: Language;
}

const CalendarEvent: React.FC<EventProps> = ({
  title,
  start_date,
  event_link,
  language,
  location,
  hide_location,
}) => (
  <div className={styles.matluEvent}>
    <span className={styles.eventTitle}>
      {event_link !== null ? (
        <a href={event_link} target="_blank" rel="noopener noreferrer">
          {title[language]}
        </a>
      ) : (
        title[language]
      )}
    </span>
    {start_date !== null && (
      <span className={styles.eventTime}>
        {format(parseISO(start_date), "do MMMM yyyy HH:mm", {
          locale: language === "fi" ? fi : enUS,
        })}{" "}
      </span>
    )}
    {!hide_location && location !== null && (
      <span className={styles.eventLocation}>{location[language]}</span>
    )}
  </div>
);

export default CalendarEvent;
