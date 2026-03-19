import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  DocumentNode,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import qs from "qs";

const STRAPI_URL = (process.env.API_URL || "http://127.0.0.1:1337").replace(
  /\/$/,
  "",
);
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
      // This ensures Apollo doesn't store data in its own memory cache,
      // letting Next.js handle the caching/revalidation via fetch.
      fetchPolicy: "no-cache",
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

// Keep the old fetchStrapi for now, but mark it for removal or refactor
export async function fetchStrapi<T>(
  path: string,
  urlParamsObject: Record<string, unknown> = {},
  options: RequestInit = {},
): Promise<T> {
  const queryString = qs.stringify(urlParamsObject, {
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

  let response: Response;

  try {
    response = await fetch(requestUrl, mergedOptions);
  } catch (error) {
    console.error("[strapi:rest] network failure", {
      requestUrl,
      method: mergedOptions.method || "GET",
      hasAuthToken: Boolean(STRAPI_TOKEN),
      params: urlParamsObject,
      error: extractErrorDetails(error),
    });

    throw error;
  }

  if (!response.ok) {
    const responseText = await response.text().catch(() => "");

    console.error("[strapi:rest] non-ok response", {
      requestUrl,
      method: mergedOptions.method || "GET",
      status: response.status,
      statusText: response.statusText,
      bodySnippet: responseText.slice(0, 600),
      hasAuthToken: Boolean(STRAPI_TOKEN),
      params: urlParamsObject,
    });

    throw new Error(
      `Strapi request failed (${response.status}) ${response.statusText}`,
    );
  }

  const data = (await response.json()) as T;
  return data;
}
