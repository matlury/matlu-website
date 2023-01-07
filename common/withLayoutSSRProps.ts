import { FooterDocument } from 'components/Footer/FooterDocument'
import { LayoutSSRProps } from 'components/Layout'
import { NavItem } from 'components/Nav'
import type { GetServerSideProps } from 'next'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__'
import { GetLayoutSsrDataQuery } from '__generated__/graphql'
import { getLocale, LocaleName } from './locale'
import { notNullOrUndefined } from './util'

const getNavItems = (
    { pages }: GetLayoutSsrDataQuery,
    locale: LocaleName
): NavItem[] => {
    if (!pages) {
        return []
    }

    return pages.filter(notNullOrUndefined).map(({ id, page, Title }) => ({
        id,
        page,
        title: Title?.[locale] || '',
    }))
}

const getFooterDocuments = (
    { documents }: GetLayoutSsrDataQuery,
    locale: LocaleName
): FooterDocument[] => {
    if (!documents) {
        return []
    }

    return documents.filter(notNullOrUndefined).map(({ id, file, title }) => ({
        id,
        title: title?.[locale] || '',
        url: file?.url || '/',
    }))
}

export const withLayoutSSRProps =
    <P extends { [key: string]: any }>(
        pageGetServerSideProps: GetServerSideProps<P>
    ): GetServerSideProps<P & LayoutSSRProps> =>
    async (ctx) => {
        const wrappedResponse = await pageGetServerSideProps(ctx)
        // You can return an object with `notFound` or `redirect` from
        // getServerSideProps(), which we need to handle separately.
        if ('notFound' in wrappedResponse || 'redirect' in wrappedResponse) {
            return wrappedResponse
        }

        const wrappedProps = await wrappedResponse.props

        const { data } = await client.query({
            query: gql(`
                query GetLayoutSSRData {
                    pages(
                        where: { page_nin: ["home"] }
                        sort: "Ordering"
                        publicationState: LIVE
                    ) {
                        id
                        page
                        Title {
                            fi
                            en
                        }
                    }
                    documents(sort: "ordering", publicationState: LIVE) {
                        id
                        title {
                            fi
                            en
                        }
                        file {
                            url
                        }
                    }
                    boardYears: boards(publicationState: LIVE, sort: "year:desc", where: { hidden_eq: false }) {
                        year
                    }
                }
            `),
        })

        const localeCode = getLocale(ctx.locale)

        return {
            props: {
                // pass through whatever props the page returned
                ...wrappedProps,
                // and add in the layout SSR props
                locale: localeCode,
                navItems: getNavItems(data, localeCode),
                footerDocuments: getFooterDocuments(data, localeCode),
                latestBoardYear:
                    data.boardYears?.filter(notNullOrUndefined)[0]?.year ??
                    null,
            },
        }
    }
