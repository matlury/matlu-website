import { dateFnsLocales, LocaleName } from 'common/locale'
import { NonNullableFields, notNullOrUndefined } from 'common/util'
import { format, parseISO } from 'date-fns'
import styles from 'styles/components/CalendarEvent.module.scss'

import { GetCalendarEventsQuery } from '__generated__/graphql'

export type EventsDataType = NonNullableFields<
    NonNullable<GetCalendarEventsQuery['calendarEvents']>
>
type EventDataType = EventsDataType[0]

interface CalendarEventItemProps {
    event: EventDataType
    locale: LocaleName
}

const CalendarEventItem = ({
    event: { title, start_date, event_link, location, hide_location },
    locale,
}: CalendarEventItemProps) => {
    const localizedTitle = title?.[locale]

    return (
        <div className={styles.matluEvent}>
            <span className={styles.eventTitle}>
                {notNullOrUndefined(event_link) ? (
                    <a
                        href={event_link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {localizedTitle}
                    </a>
                ) : (
                    localizedTitle
                )}
            </span>
            {notNullOrUndefined(start_date) && (
                <span className={styles.eventTime}>
                    {format(parseISO(start_date), 'do MMMM yyyy HH:mm', {
                        locale: dateFnsLocales[locale],
                    })}{' '}
                </span>
            )}
            {!hide_location && notNullOrUndefined(location) && (
                <span className={styles.eventLocation}>{location[locale]}</span>
            )}
        </div>
    )
}

interface CalendarEventsProps {
    locale: LocaleName
    events: EventsDataType
}

const CalendarEvents = ({ locale, events }: CalendarEventsProps) =>
    events.length === 0 ? (
        <p>
            {locale === 'fi' ? 'Ei tulevia tapahtumia.' : 'No upcoming events.'}
        </p>
    ) : (
        <>
            {events.map((event) => (
                <CalendarEventItem
                    key={event.id}
                    locale={locale}
                    event={event}
                />
            ))}
        </>
    )

export default CalendarEvents
