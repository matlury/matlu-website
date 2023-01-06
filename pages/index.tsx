import { getLocale } from 'common/locale'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import Layout, { LayoutSSRProps } from 'components/Layout'
import Title from 'components/Title'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__/gql'

interface HomeProps {
    title: string
    bodyMarkdown: string
}

export default function Home({
    title,
    bodyMarkdown,
    ...layoutProps
}: HomeProps & LayoutSSRProps) {
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

export const getServerSideProps = withLayoutSSRProps<HomeProps>(
    async ({ locale }) => {
        const localeCode = getLocale(locale)

        const { data } = await client.query({
            query: gql(`
            query GetHomePage {
                pages(where: { page_eq: "home" }, publicationState: LIVE) {
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
        })

        const page = data?.pages?.[0]
        const title = page?.Title?.[localeCode] || 'Matlu ry'
        const bodyMarkdown = page?.body?.[localeCode] || ''
        return {
            props: {
                title,
                bodyMarkdown,
            },
        }
    }
)
