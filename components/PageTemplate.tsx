import { formatTitle } from 'common/util'
import Layout, { LayoutSSRProps } from 'components/Layout'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

export interface PageProps {
    title: string
    bodyMarkdown: string
}

export default function PageTemplate({
    title,
    bodyMarkdown,
    ...layoutProps
}: PageProps & LayoutSSRProps) {
    return (
        <>
            <Head>
                <title>{formatTitle(title)}</title>
            </Head>
            <Layout {...layoutProps}>
                <ReactMarkdown remarkPlugins={[gfm]}>
                    {bodyMarkdown}
                </ReactMarkdown>
            </Layout>
        </>
    )
}
