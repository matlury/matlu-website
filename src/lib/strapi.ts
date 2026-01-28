import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject, DocumentNode, ApolloQueryResult } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const STRAPI_URL = (process.env.API_URL || "http://localhost:1337").replace(/\/$/, "");
const STRAPI_GRAPHQL_URL = `${STRAPI_URL}/graphql`;
const STRAPI_TOKEN = process.env.ACCESS_TOKEN;

const httpLink = new HttpLink({
  uri: STRAPI_GRAPHQL_URL,
  fetch, // Use global fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined", // Set to true for SSR
});

export async function fetchGraphQL<T>(query: DocumentNode, variables?: Record<string, any>) {
  return client.query<T>({
    query,
    variables,
  });
}

// Keep the old fetchStrapi for now, but mark it for removal or refactor
// export async function fetchStrapi<T>(
//   path: string,
//   urlParamsObject: Record<string, any> = {},
//   options: RequestInit = {},
// ): Promise<T> {
//   const queryString = qs.stringify(urlParamsObject, {
//     encodeValuesOnly: true, // prettify URL
//   });

//   const mergedOptions = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
//     },
//     ...options,
//   };

//   const requestUrl = `${STRAPI_URL}/api/${path}${queryString ? `?${queryString}` : ""}`;

//   const response = await fetch(requestUrl, mergedOptions);

//   if (!response.ok) {
//     console.error(response.statusText);
//     throw new Error(`An error occurred while fetching from Strapi: ${response.statusText}`);
//   }

//   const data = await response.json();
//   return data;
// }
