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

type AddParameters<
    TFunction extends (...args: any) => any,
    TParameters extends [...args: any]
> = (
    ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>

type PropsType = { [key: string]: any }

// This HoC HoC takes care of returning early if the wrapped getServerSideProps
// returned a 404 or a redirect, and passes its props to your HoC.
export const makeGetServerSidePropsHoc =
    <TWrappedProps extends PropsType, TMyProps extends PropsType>(
        hocGetServerSideProps: AddParameters<
            GetServerSideProps<TWrappedProps & TMyProps>,
            [wrappedArgs: TWrappedProps]
        >
    ) =>
    <TWrapped extends PropsType>(
        wrappedGetServerSideProps: GetServerSideProps<TWrappedProps>
    ): GetServerSideProps<TWrappedProps & TMyProps> =>
    async (ctx) => {
        const returned = await wrappedGetServerSideProps(ctx)
        // You can return an object with `notFound` or `redirect` from
        // getServerSideProps(), which we need to handle separately.
        if ('notFound' in returned || 'redirect' in returned) {
            return returned
        }

        // Apparently it's okay for props to be a Promise?
        const wrappedProps = await returned.props
        return hocGetServerSideProps(ctx, wrappedProps)
    }

export const withLayoutSSRProps = makeGetServerSidePropsHoc(
    async (ctx, wrappedProps) => {
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
            } satisfies LayoutSSRProps,
        }
    }
)
