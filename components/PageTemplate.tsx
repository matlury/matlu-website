import { formatTitle } from 'common/util'
import Layout, { LayoutSSRProps } from 'components/Layout'
import Head from 'next/head'
import { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

export interface PageTemplateProps {
    title: string
    bodyMarkdown: string
}

export default function PageTemplate({
    title,
    bodyMarkdown,
    children,
    ...layoutProps
}: PropsWithChildren<PageTemplateProps & LayoutSSRProps>) {
    return (
        <>
            <Head>
                <title>{formatTitle(title)}</title>
            </Head>
            <Layout {...layoutProps}>
                {children}
                <ReactMarkdown remarkPlugins={[gfm]}>
                    {bodyMarkdown}
                </ReactMarkdown>
            </Layout>
        </>
    )
}
