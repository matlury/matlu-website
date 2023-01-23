import Head from 'next/head'

const HeadTitle = ({ title }: { title: string }) => (
    <Head>
        <title>{`${title} | Matlu ry`}</title>
        <meta property="og:title" content={title} />
        <meta property="twitter:title" content={title} />
    </Head>
)

export default HeadTitle
