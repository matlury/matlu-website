import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  DocumentNode,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import qs from "qs";

const STRAPI_URL = (process.env.API_URL || "http://localhost:1337").replace(
  /\/$/,
  "",
);
/* global fetch */
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
    } as Record<string, string>,
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined", // Set to true for SSR
});

export async function fetchGraphQL<T>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
) {
  const mergedVariables = {
    locale: "fi", // Default locale
    ...variables,
  };

  return client.query<T>({
    query,
    variables: mergedVariables,
    // This ensures Apollo doesn't store data in its own memory cache,
    // letting Next.js handle the caching/revalidation via fetch.
    fetchPolicy: "no-cache",
  });
}

// Keep the old fetchStrapi for now, but mark it for removal or refactor
export async function fetchStrapi<T>(
  path: string,
  urlParamsObject: Record<string, any> = {},
  options: RequestInit = {},
): Promise<T> {
  // Ensure locale is set, defaulting to 'fi'
  const params = {
    locale: "fi",
    ...urlParamsObject,
  };

  const queryString = qs.stringify(params, {
    encodeValuesOnly: true, // prettify URL
  });

  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    ...options,
  };

  const requestUrl = `${STRAPI_URL}/api/${path}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(requestUrl, mergedOptions);

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(
      `An error occurred while fetching from Strapi: ${response.statusText}`,
    );
  }

  const data = (await response.json()) as T;
  return data;
}
