import Head from 'next/head'

const Title = ({ title }: { title: string }) => (
    <Head>
        <title>{title} | Matlu ry</title>
    </Head>
)

export default Title
