import { CodegenConfig } from '@graphql-codegen/cli'

const schemaUrl = process.env.CMS_GRAPHQL_URL || 'https://cms.matlu.fi/graphql'

const config: CodegenConfig = {
    schema: schemaUrl,
    documents: ['pages/**/*.{tsx,ts}', 'services/**/*.{tsx,ts}'],
    generates: {
        './__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            },
        },
    },
    ignoreNoDocuments: true,
}

export default config
