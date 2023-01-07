import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import Layout, { LayoutSSRProps } from 'components/Layout'

const Ilotalo = ({ locale, ...layoutProps }: LayoutSSRProps) => (
    <Layout locale={locale} {...layoutProps}>
        {locale === 'fi' ? (
            <>
                <h1>Matlu Klusterin varauskalenteri</h1>
                <p>
                    Siirry Matlu Klusterin varauskalenteriin tästä linkistä:{' '}
                    <a
                        href="https://ilotalo.matlu.fi"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://ilotalo.matlu.fi
                    </a>
                    .
                </p>
            </>
        ) : (
            <>
                <h1>Matlu Klusteri reservations calendar</h1>
                <p>
                    Visit Matlu Klusteri reservations calendar by clicking this
                    link:{' '}
                    <a
                        href="https://ilotalo.matlu.fi"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://ilotalo.matlu.fi
                    </a>
                    .
                </p>
            </>
        )}
    </Layout>
)

export default Ilotalo

export const getServerSideProps = withLayoutSSRProps(async () => ({
    props: {
        seo: {
            description: 'Matlu Klusterin varauskalenteri',
            hideFromSearchEngine: true,
        },
    },
}))
