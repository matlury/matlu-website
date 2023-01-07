import { getLocale } from 'common/locale'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import PageTemplate, { PageTemplateProps } from 'components/PageTemplate'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__/gql'

export default PageTemplate

export const getServerSideProps = gsspWithNonce(
    withLayoutSSRProps<PageTemplateProps>(async ({ locale }) => {
        const localeCode = getLocale(locale)

        const { data } = await client.query({
            query: gql(`
                query GetHomePage {
                    pages(where: { page_eq: "home" }, publicationState: LIVE) {
                        id
                        Title {
                            id
                            fi
                            en
                        }
                        body {
                            id
                            fi: Fi
                            en: En
                        }
                        Description {
                            id
                            fi
                            en
                        }
                        HideFromSearchEngine
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
                seo: {
                    description: page?.Description?.[localeCode],
                    hideFromSearchEngine: !!page?.HideFromSearchEngine,
                },
            },
        }
    }
)
