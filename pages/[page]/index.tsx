import { getLocale } from 'common/locale'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import Layout, { LayoutSSRProps } from 'components/Layout'
import Title from 'components/Title'
import Head from 'next/head'
import type { ParsedUrlQuery } from 'querystring'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__/gql'

interface PageProps {
    title: string
    bodyMarkdown: string
}

export default function Home({
    title,
    bodyMarkdown,
    ...layoutProps
}: PageProps & LayoutSSRProps) {
    return (
        <>
            <Head>
                <Title title={title} />
            </Head>
            <Layout {...layoutProps}>
                <ReactMarkdown remarkPlugins={[gfm]}>
                    {bodyMarkdown}
                </ReactMarkdown>
            </Layout>
        </>
    )
}

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

        if (!pageSlug) {
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
