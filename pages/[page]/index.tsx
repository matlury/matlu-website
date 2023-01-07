import { HOME_PAGE_NAME } from 'common/constants'
import { getLocale } from 'common/locale'
import { notNullOrUndefined, omit } from 'common/util'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import EventsPageTemplate, {
    EventsPageTemplateProps,
} from 'components/EventsPageTemplate'
import { LayoutSSRProps } from 'components/Layout'
import PageTemplate, { PageTemplateProps } from 'components/PageTemplate'
import { subWeeks } from 'date-fns'
import type { ParsedUrlQuery } from 'querystring'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__/gql'

type PageProps = PageTemplateProps & { type: 'page' }
type EventsPageProps = EventsPageTemplateProps & { type: 'events' }
type Props = PageProps | EventsPageProps

const Page = (props: Props & LayoutSSRProps) => {
    if (props.type === 'events') {
        return <EventsPageTemplate {...omit('type', props)} />
    }

    return <PageTemplate {...omit('type', props)} />
}

export default Page

const getPage = (params: ParsedUrlQuery | undefined) => {
    if (!params) return null

    const page = params['page']
    if (typeof page !== 'string') return null

    return page
}

const fetchCalendarEvents = async () => {
    const { data } = await client.query({
        query: gql(`
            query GetCalendarEvents($since: DateTime!) {
                calendarEvents(
                    sort: "start_date:asc"
                    where: { hidden_eq: false, start_date_gte: $since }
                ) {
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
        `),
        variables: {
            since: subWeeks(new Date(), 1),
        },
    })

    return (data.calendarEvents ?? []).filter(notNullOrUndefined)
}

export const getServerSideProps = withLayoutSSRProps<Props>(
    async ({ params, locale }) => {
        const localeCode = getLocale(locale)
        const pageSlug = getPage(params)

        if (!pageSlug || pageSlug === HOME_PAGE_NAME) {
            return {
                notFound: true,
            }
        }

        const { data } = await client.query({
            query: gql(`
                query GetPageByName($pageName: String!) {
                    pages(where: { page_eq: $pageName }, publicationState: LIVE) {
                        Title {
                            fi
                            en
                        }
                        body {
                            fi: Fi
                            en: En
                        }
                    }
                }
            `),
            variables: {
                pageName: pageSlug,
            },
        })

        const page = data?.pages?.[0]
        if (!page) {
            return {
                notFound: true,
            }
        }

        const title = page.Title?.[localeCode] || 'Matlu ry'
        const bodyMarkdown = page.body?.[localeCode] || ''

        if (pageSlug === 'events') {
            const events = await fetchCalendarEvents()
            return {
                props: {
                    type: 'events',
                    title,
                    bodyMarkdown,
                    events,
                },
            }
        }

        return {
            props: {
                type: 'page',
                title,
                bodyMarkdown,
            },
        }
    }
)
