import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  DocumentNode,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const STRAPI_URL = (process.env.API_URL || "http://127.0.0.1:1337").replace(
  /\/$/,
  "");
const STRAPI_GRAPHQL_URL = `${STRAPI_URL}/graphql`;

const STRAPI_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:1337"
).replace(/\/$/, "");
const STRAPI_PUBLIC_GRAPHQL_URL = `${STRAPI_PUBLIC_URL}/graphql`;
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
  ssrMode: typeof window === "undefined",
});

const httpLinkNoAuth = new HttpLink({
  uri: STRAPI_PUBLIC_GRAPHQL_URL,
  fetch,
});

export const browserClient = new ApolloClient({
  link: httpLinkNoAuth,
  cache: new InMemoryCache(),
  ssrMode: false,
});

function extractErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const maybeCause = error.cause as
      | { code?: unknown; errno?: unknown; syscall?: unknown }
      | undefined;

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: maybeCause
        ? {
          code: typeof maybeCause.code === "string" ? maybeCause.code : undefined,
          errno: typeof maybeCause.errno === "number" ? maybeCause.errno : undefined,
          syscall:
            typeof maybeCause.syscall === "string"
              ? maybeCause.syscall
              : undefined,
        }
        : undefined,
    };
  }

  return { value: String(error) };
}

export async function fetchGraphQL<T>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
) {
  try {
    return await client.query<T>({
      query,
      variables,
      fetchPolicy: "cache-first",
    });
  } catch (error) {
    const queryPreview = query.loc?.source.body
      ? query.loc.source.body.replace(/\s+/g, " ").slice(0, 160)
      : undefined;

    console.error("[strapi:graphql] request failed", {
      endpoint: STRAPI_GRAPHQL_URL,
      hasAuthToken: Boolean(STRAPI_TOKEN),
      queryPreview,
      variables,
      error: extractErrorDetails(error),
    });

    throw error;
  }
}

export async function fetchGraphQLClient<T>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
) {
  try {
    return await browserClient.query<T>({
      query,
      variables,
      fetchPolicy: "network-only",
    });
  } catch (error) {
    const queryPreview = query.loc?.source.body
      ? query.loc.source.body.replace(/\s+/g, " ").slice(0, 160)
      : undefined;

    console.error("[strapi:graphql] client request failed", {
      endpoint: STRAPI_GRAPHQL_URL,
      hasAuthToken: Boolean(STRAPI_TOKEN),
      queryPreview,
      variables,
      error: extractErrorDetails(error),
    });

    throw error;
  }
}
