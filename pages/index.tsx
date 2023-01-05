import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { getLocale } from '../common/locale'
import client from '../services/cms/apollo-client'
import { parseMarkdown } from '../services/markdown'
import styles from '../styles/Home.module.css'
import { gql } from '../__generated__/gql'

interface HomeProps {
    title: string
    bodyHtml: string
}

export default function Home({ title, bodyHtml }: HomeProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            </main>
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
    const bodyHtml = await parseMarkdown(bodyMarkdown)
    return {
        props: {
            title,
            bodyHtml,
        },
    }
}
