import { MetadataRoute } from "next";
import { getSitemapPages, getSitemapBoards } from "../lib/cms-data";

export const dynamic = "force-static";

const SITE_URL = process.env.SITE_URL || "https://www.matlu.fi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, boards] = await Promise.all([
    getSitemapPages(),
    getSitemapBoards(),
  ]);

  const sitemapPages = pages
    .filter((p) => !p.HideFromSearchEngine && p.page !== "home")
    .flatMap((p) => [
      {
        url: `${SITE_URL}/${p.page}`,
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

  const sitemapBoards = boards
    .filter((b) => !b.hidden)
    .flatMap((b) => [
      {
        url: `${SITE_URL}/board/${b.year}`,
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

  const latestBoard = boards.find((b) => !b.hidden);

  const mainBoardPages = latestBoard
    ? [
        {
          url: `${SITE_URL}/board`,
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
      url: `${SITE_URL}`,
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
    ...sitemapPages,
    ...sitemapBoards,
    ...mainBoardPages,
    {
      url: `${SITE_URL}/ilotalo`,
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
  ];
}
