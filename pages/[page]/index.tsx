import { HOME_PAGE_NAME } from 'common/constants'
import { getLocale } from 'common/locale'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import PageTemplate, { PageProps } from 'components/PageTemplate'
import type { ParsedUrlQuery } from 'querystring'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__/gql'

export default PageTemplate

const getPage = (params: ParsedUrlQuery | undefined) => {
    if (!params) return null

    const page = params['page']
    if (typeof page !== 'string') return null

    return page
}

export const getServerSideProps = withLayoutSSRProps<PageProps>(
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

        return {
            props: {
                title,
                bodyMarkdown,
            },
        }
    }
)
