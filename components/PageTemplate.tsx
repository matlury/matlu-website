import Layout, { LayoutSSRProps } from 'components/Layout'
import { PropsWithChildren } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import HeadTitle from './HeadTitle'

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
            <HeadTitle title={title} />
            <Layout {...layoutProps}>
                {children}
                <ReactMarkdown remarkPlugins={[gfm]}>
                    {bodyMarkdown}
                </ReactMarkdown>
            </Layout>
        </>
    )
}
