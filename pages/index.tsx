import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { getLocale, LocaleName } from '../common/locale'
import client from '../services/cms/apollo-client'
import { gql } from '../__generated__/gql'

interface HomeProps {
    title: string
    bodyMarkdown: string
    locale: LocaleName
}

export default function Home({ title, bodyMarkdown, locale }: HomeProps) {
    return (
        <>
            <Head>
                <Title title={title} />
            </Head>
            <Layout locale={locale}>
                <ReactMarkdown remarkPlugins={[gfm]}>
                    {bodyMarkdown}
                </ReactMarkdown>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
    locale,
}) => {
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
            locale: localeCode,
        },
    }
}
