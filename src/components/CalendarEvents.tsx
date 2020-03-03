import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Language } from "../utils"
import CalendarEvent from "./CalendarEvent"

interface CalendarEventsProps {
  language: Language
  showAll?: boolean
}

const CalendarEvents: React.FC<CalendarEventsProps> = ({
  language,
  showAll = false,
}) => {
  const data = useStaticQuery(graphql`
    query CalendarEventsQuery {
      allStrapiCalendarEvent(
        sort: { fields: start_date, order: ASC }
        filter: { hidden: { eq: false } }
      ) {
        nodes {
          id
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
  `)
  const eventData = data.allStrapiCalendarEvent.nodes
  let events = eventData
  if (!showAll) {
    const [first, second] = eventData
    events = [first, second]
  }
  return (
    <div>
      {events
        .filter(evt => evt !== undefined)
        .map(evt => (
          <CalendarEvent
            key={evt.id}
            language={language}
            title={evt.title}
            hide_location={evt.hide_location}
            location={evt.location}
            start_date={evt.start_date}
            event_link={evt.event_link}
          />
        ))}
    </div>
  )
}

export default CalendarEvents
