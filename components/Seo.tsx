import siteMetadata from 'common/siteMetadata'
import Head from 'next/head'

export interface SeoProps {
    description?: string
    hideFromSearchEngine?: boolean
}

const SEO = ({
    description = siteMetadata.description,
    hideFromSearchEngine,
}: SeoProps) => (
    <Head>
        {hideFromSearchEngine ? (
            <meta name="robots" content="noindex,nofollow" />
        ) : (
            <meta name="robots" content="all" />
        )}
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
    </Head>
)

export default SEO
