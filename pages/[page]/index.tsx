import { gsspWithNonce } from '@next-safe/middleware/dist/document'
import { HOME_PAGE_NAME } from 'common/constants'
import { getLocale } from 'common/locale'
import siteMetadata from 'common/siteMetadata'
import { notNullOrUndefined, omit } from 'common/util'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import ContactPageTemplate, {
    ContactPageTemplateProps,
} from 'components/ContactPageTemplate'
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
type ContactPageProps = ContactPageTemplateProps & { type: 'contact' }
type Props = PageProps | EventsPageProps | ContactPageProps

const Page = (props: Props & LayoutSSRProps) => {
    switch (props.type) {
        case 'events':
            return <EventsPageTemplate {...omit('type', props)} />
        case 'contact':
            return <ContactPageTemplate {...omit('type', props)} />
        default:
            return <PageTemplate {...omit('type', props)} />
    }
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
                        id
                        fi
                        en
                    }
                    location {
                        id
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

export const getServerSideProps = gsspWithNonce(
    withLayoutSSRProps<Props>(async ({ params, locale }) => {
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
                        id
                        Title {
                            id
                            fi
                            en
                        }
                        body {
                            id
                            fi: Fi
                            en: En
                        }
                        Description {
                            id
                            fi
                            en
                        }
                        HideFromSearchEngine
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

        const seo = {
            description: page.Description?.[localeCode],
            hideFromSearchEngine: !!page.HideFromSearchEngine,
        }

        if (pageSlug === 'events') {
            const events = await fetchCalendarEvents()
            return {
                props: {
                    type: 'events',
                    title,
                    bodyMarkdown,
                    events,
                    seo,
                },
            }
        }
        if (pageSlug === 'contact') {
            return {
                props: {
                    type: 'contact',
                    title,
                    bodyMarkdown,
                    reCaptchaSiteKey: siteMetadata.recaptchaSiteKey,
                    seo,
                },
            }
        }

        return {
            props: {
                type: 'page',
                title,
                bodyMarkdown,
                seo,
            },
        }
    })
)
