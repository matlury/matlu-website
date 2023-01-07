import { getLocale } from 'common/locale'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import PageTemplate, { PageTemplateProps } from 'components/PageTemplate'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__/gql'

export default PageTemplate

export const getServerSideProps = withLayoutSSRProps<PageTemplateProps>(
    async ({ locale }) => {
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
        return {
            props: {
                title,
                bodyMarkdown,
            },
        }
    }
)
