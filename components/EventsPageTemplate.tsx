import { LayoutSSRProps } from 'components/Layout'
import CalendarEvents, { EventsDataType } from './CalendarEvents'
import PageTemplate, { PageTemplateProps } from './PageTemplate'

export interface EventsPageTemplateProps extends PageTemplateProps {
    events: EventsDataType
}

const EventsPageTemplate = ({
    locale,
    events,
    ...props
}: EventsPageTemplateProps & LayoutSSRProps) => {
    return (
        <PageTemplate locale={locale} {...props}>
            <h1>
                {locale === 'fi' ? 'Tulevat tapahtumat' : 'Upcoming events'}
            </h1>
            <div>
                <CalendarEvents locale={locale} events={events} />
            </div>
        </PageTemplate>
    )
}

export default EventsPageTemplate
