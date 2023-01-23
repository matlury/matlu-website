import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    uri: 'https://cms.matlu.fi/graphql',
    cache: new InMemoryCache(),
})

export default client
