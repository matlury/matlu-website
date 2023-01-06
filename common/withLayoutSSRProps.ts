import { FooterDocument } from 'components/Footer/FooterDocument'
import { LayoutSSRProps } from 'components/Layout'
import { NavItem } from 'components/Nav'
import { GetServerSideProps } from 'next'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__'
import { GetLayoutSsrDataQuery } from '__generated__/graphql'
import { getLocale, LocaleName } from './locale'
import { notNull } from './util'

const getNavItems = (
    { pages }: GetLayoutSsrDataQuery,
    locale: LocaleName
): NavItem[] => {
    if (!pages) {
        return []
    }

    return pages.filter(notNull).map(({ id, page, Title }) => ({
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

    return documents.filter(notNull).map(({ id, file, title }) => ({
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
        const localeCode = getLocale(ctx.locale)

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
                }
            `),
        })

        const pagePropsValue = await pageGetServerSideProps(ctx)
        // You can return an object with `notFound` or `redirect` from
        // getServerSideProps(), which we need to handle separately.
        if ('notFound' in pagePropsValue || 'redirect' in pagePropsValue) {
            return pagePropsValue
        }

        // Apparently it's okay for props to be a Promise?
        const props = await pagePropsValue.props

        return {
            props: {
                // pass through whatever props the page returned
                ...props,
                // and add in the layout SSR props
                locale: localeCode,
                navItems: getNavItems(data, localeCode),
                footerDocuments: getFooterDocuments(data, localeCode),
            },
        }
    }
