import { cache } from "react";
import fs from "fs/promises";
import path from "path";
import { fetchGraphQL } from "./strapi";

import {
  HOME_PAGE_QUERY,
  type HomePageQueryResult,
} from "../queries/home";

import {
  PAGE_QUERY,
  ALL_PAGES_QUERY,
  type PageQueryResult,
  type AllPagesQueryResult,
} from "../queries/pages";

import { NAV_QUERY, type NavQueryResult } from "../queries/nav";
import { MEMBERS_QUERY, type MembersQueryResult } from "../queries/footer";
import { DOCUMENTS_QUERY, type DocumentsQueryResult } from "../queries/documents";
import {
  BOARD_QUERY,
  LATEST_BOARD_QUERY,
  ALL_BOARD_YEARS_QUERY,
  type BoardQueryResult,
  type BoardYearsQueryResult,
} from "../queries/board";
import {
  SITEMAP_PAGES_QUERY,
  SITEMAP_BOARDS_QUERY,
  type SitemapPagesQueryResult,
  type SitemapBoardsQueryResult,
} from "../queries/sitemap";
import {
  EVENT_SUGGESTIONS_QUERY,
  TITLE_SUGGESTIONS_QUERY,
  type EventSuggestionsQueryResult,
  type TitleSuggestionsQueryResult,
  type LocationSuggestion,
  type TitleSuggestion,
} from "../queries/events";

const STRAPI_URL = (process.env.API_URL || "http://localhost:1337").replace(
  /\/$/,
  "");

function toAbsoluteStrapiUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// ============================================================================
// Types (re-exported for convenience)
// ============================================================================

export interface SeoFields {
  metaTitle?: { fi: string; en: string };
  metaDescription?: { fi: string; en: string };
  shareImage?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  canonicalUrl?: string;
}

export interface PageData {
  documentId: string;
  page: string;
  Title: { fi: string; en: string };
  Description: { fi: string; en: string };
  body: { Fi: string; En: string };
  HideFromSearchEngine: boolean;
  Draft: boolean;
  Seo?: SeoFields;
}

export interface CalendarEventData {
  documentId: string;
  start_date: string;
  end_date: string | null;
  title: { fi: string; en: string };
  location: { fi: string; en: string } | null;
  description: { fi: string; en: string } | null;
  organizer_name: string | null;
  price: string | null;
  event_link: string;
  hide_location: boolean;
  location_coordinates: { lat: number; lng: number } | null;
  hidden: boolean;
}

export interface FooterLogo {
  id: string;
  name: string;
  href: string;
  src: string;
  alt: string;
}

export interface NavLink {
  id: string;
  page: string;
  Ordering: number;
  Draft: boolean;
  Title: { en: string; fi: string };
}

export interface DocumentNode {
  documentId: string;
  title: { fi: string; en: string };
  file: { url: string } | null;
}

export interface BoardMember {
  id: string;
  name: string;
  email: string | null;
  role: { fi: string; en: string };
}

export interface Officer {
  id: string;
  name: string;
  role: { fi: string; en: string };
}

export interface TeamMember {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  title: { fi: string; en: string };
  team_members: TeamMember[];
}

export interface BoardData {
  documentId: string;
  year: number;
  members: BoardMember[] | null;
  officers: Officer[] | null;
  teams: Team[] | null;
  hidden: boolean;
  Seo?: SeoFields;
}

// Re-export event suggestion types
export type { LocationSuggestion, TitleSuggestion };

// ============================================================================
// Cached Query Functions
// ============================================================================

export const getHomePageData = cache(async () => {
  const { data } = await fetchGraphQL<HomePageQueryResult>(HOME_PAGE_QUERY);
  if (!data?.pages || data.pages.length === 0) return { page: null, events: [] };
  return { page: data.pages[0], events: data.calendarEvents || [] };
});

export const getPageData = cache(async (pageSlug: string) => {
  const { data } = await fetchGraphQL<PageQueryResult>(PAGE_QUERY, { page: pageSlug });
  if (!data?.pages || data.pages.length === 0) return null;
  return data.pages[0];
});

export const getAllPages = cache(async () => {
  const { data } = await fetchGraphQL<AllPagesQueryResult>(ALL_PAGES_QUERY);
  return data?.pages || [];
});

export const getAllPageSlugs = cache(async () => {
  const pages = await getAllPages();
  return pages
    .filter((p) => p.page !== "home" && p.page !== "board")
    .map((p) => p.page);
});

export const getNavLinks = cache(async () => {
  const { data } = await fetchGraphQL<NavQueryResult>(NAV_QUERY);
  return (data?.pages || []).map((node) => ({
    id: node.documentId,
    page: node.page,
    Ordering: node.Ordering,
    Draft: node.Draft,
    Title: node.Title,
  }));
});

export const getFooterMembers = cache(async () => {
  const { data } = await fetchGraphQL<MembersQueryResult>(MEMBERS_QUERY);

  // Try to load optimized logo manifest (generated at build time)
  let logoManifest: Record<string, { src: string; alt: string; href: string; name: string }> | null = null;
  try {
    const manifestPath = path.join(process.cwd(), "public", "logos", "members", "manifest.json");
    const raw = await fs.readFile(manifestPath, "utf-8");
    logoManifest = JSON.parse(raw);
  } catch {
    // Manifest not found - fall back to CMS URLs (development mode)
  }

  return (data?.members || [])
    .filter((item) => item.logo?.url)
    .map((item) => {
      const optimized = logoManifest?.[item.documentId];
      return {
        id: item.documentId,
        name: item.name,
        href: optimized?.href || item.url || "#",
        src: optimized?.src || toAbsoluteStrapiUrl(item.logo!.url),
        alt: optimized?.alt || item.logo!.alternativeText || item.name,
      };
    });
});

export const getDocuments = cache(async () => {
  const { data } = await fetchGraphQL<DocumentsQueryResult>(DOCUMENTS_QUERY);

  return (data?.documents || []).map((node) => ({
    documentId: node.documentId,
    title: node.title,
    file: node.file ? { url: toAbsoluteStrapiUrl(node.file.url) } : null,
  }));
});

export const getBoardData = cache(async (year?: number) => {
  try {
    const { data } = await fetchGraphQL<BoardQueryResult>(
      year !== undefined ? BOARD_QUERY : LATEST_BOARD_QUERY,
      year !== undefined ? { year } : undefined,
    );
    if (!data?.boards || data.boards.length === 0) return null;
    return data.boards[0];
  } catch (error) {
    console.error("Failed to fetch board data", error);
    return null;
  }
});

export const getAllBoardYears = cache(async () => {
  try {
    const { data } = await fetchGraphQL<BoardYearsQueryResult>(ALL_BOARD_YEARS_QUERY);
    if (!data?.boards) return [];
    return data.boards.map((board) => board.year);
  } catch (error) {
    console.error("Failed to fetch board years", error);
    return [];
  }
});

export const getSitemapPages = cache(async () => {
  const { data } = await fetchGraphQL<SitemapPagesQueryResult>(SITEMAP_PAGES_QUERY);
  return data?.pages || [];
});

export const getSitemapBoards = cache(async () => {
  const { data } = await fetchGraphQL<SitemapBoardsQueryResult>(SITEMAP_BOARDS_QUERY);
  return data?.boards || [];
});

export const getEventSuggestions = cache(async () => {
  const [locationsResult, titlesResult] = await Promise.all([
    fetchGraphQL<EventSuggestionsQueryResult>(EVENT_SUGGESTIONS_QUERY),
    fetchGraphQL<TitleSuggestionsQueryResult>(TITLE_SUGGESTIONS_QUERY),
  ]);

  const locationSuggestions: LocationSuggestion[] = (
    locationsResult.data?.eventLocations || []
  ).map((loc) => {
    const coords = loc.location_coordinates as { lat: number; lng: number } | null;
    return {
      documentId: loc.documentId,
      label_fi: loc.label_fi,
      label_en: loc.label_en,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
    };
  });

  const uniqueTitles = new Map<string, TitleSuggestion>();
  for (const event of titlesResult.data?.eventRequests || []) {
    if (event.title?.fi && !uniqueTitles.has(event.title.fi)) {
      uniqueTitles.set(event.title.fi, event.title);
    }
  }
  const titleSuggestions: TitleSuggestion[] = Array.from(uniqueTitles.values());

  return { locationSuggestions, titleSuggestions };
});