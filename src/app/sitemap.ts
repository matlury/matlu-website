import { MetadataRoute } from "next";
import { fetchGraphQL } from "../lib/strapi";
import { gql } from "@apollo/client";

export const dynamic = "force-static";

const SITE_URL = process.env.SITE_URL || "https://www.matlu.fi";

interface PageData {
  page: string;
  HideFromSearchEngine: boolean;
  Draft: boolean;
}

interface BoardData {
  year: number;
  hidden: boolean;
}

interface StrapiPageQueryResult {
  pages: PageData[];
}

interface StrapiBoardQueryResult {
  boards: BoardData[];
}

const ALL_PAGES_FOR_SITEMAP_QUERY = gql`
  query AllPagesForSitemap {
    pages(filters: { Draft: { eq: false } }) {
      page
      HideFromSearchEngine
    }
  }
`;

const ALL_BOARDS_FOR_SITEMAP_QUERY = gql`
  query AllBoardsForSitemap {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      year
      hidden
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pagesResult, boardsResult] = await Promise.all([
    fetchGraphQL<StrapiPageQueryResult>(ALL_PAGES_FOR_SITEMAP_QUERY),
    fetchGraphQL<StrapiBoardQueryResult>(ALL_BOARDS_FOR_SITEMAP_QUERY),
  ]);

  const pages = (pagesResult.data?.pages || [])
    .filter((p) => !p.HideFromSearchEngine && p.page !== "home") // 'home' is handled by root '/'
    .flatMap((p) => [
      {
        url: `${SITE_URL}/fi/${p.page}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/en/${p.page}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ]);

  const boards = (boardsResult.data?.boards || [])
    .filter((b) => !b.hidden)
    .flatMap((b) => [
      {
        url: `${SITE_URL}/fi/board/${b.year}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${SITE_URL}/en/board/${b.year}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
    ]);

  // Special handling for the main board page (latest)
  const latestBoard = (boardsResult.data?.boards || []).find((b) => !b.hidden);

  const mainBoardPages = latestBoard
    ? [
      {
        url: `${SITE_URL}/fi/board`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/en/board`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]
    : [];

  return [
    {
      url: `${SITE_URL}/fi`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    ...pages,
    ...boards,
    ...mainBoardPages,
    {
      url: `${SITE_URL}/fi/ilotalo`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/en/ilotalo`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    // Thank you page and 404 are hidden from search engines, so not included
  ];
}
