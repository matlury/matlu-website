import { gsspWithNonce } from '@next-safe/middleware/dist/document'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import Layout, { LayoutSSRProps } from 'components/Layout'
import Link from 'next/link'

const ThankYou = ({ locale, ...layoutProps }: LayoutSSRProps) => (
    <Layout locale={locale} {...layoutProps}>
        {locale === 'fi' ? (
            <>
                <h1>Kiitos yhteydenotostasi!</h1>
                <p>Käsittelemme yhteydenotot mahdollisimman pian.</p>
                <Link href="/">Takaisin etusivulle</Link>
            </>
        ) : (
            <>
                <h1>Thank you for contacting us!</h1>
                <p>We will contact you as soon as possible.</p>
                <Link href="/">Back to front page</Link>
            </>
        )}
    </Layout>
)

export default ThankYou

export const getServerSideProps = gsspWithNonce(
    withLayoutSSRProps(async () => ({
        props: {
            seo: {
                description:
                    'Kiitos yhteydenotostasi! / Thank you for contacting!',
                hideFromSearchEngine: true,
            },
        },
    }))
)
