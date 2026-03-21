import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchStrapi } from "../../lib/strapi";
import { Metadata } from "next";
import CalendarEvents from "../../components/CalendarEvents";
import ContactForm from "../../components/ContactForm";
import EventRequestForm from "../../components/EventRequestForm";
import { MainLayout } from "../../components/MainLayout";

interface PageData {
  documentId: string;
  page: string;
  Title: { fi: string; en: string };
  Description: { fi: string; en: string };
  body: {
    Fi: string;
    En: string;
  };
  HideFromSearchEngine: boolean;
  Draft: boolean;
  Seo?: {
    metaTitle?: { fi: string; en: string };
    metaDescription?: { fi: string; en: string };
    shareImage?: {
      url: string;
      alternativeText?: string;
    };
    canonicalUrl?: string;
  };
}

interface LocationSuggestion {
  documentId: string;
  label_fi: string;
  label_en: string;
  latitude: number | null;
  longitude: number | null;
}

interface TitleSuggestion {
  fi: string;
  en: string;
}

interface DynamicPageQueryResult {
  data: PageData[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

type DynamicPageParams = { page: string };
type DynamicPageParamsInput = Promise<DynamicPageParams> | DynamicPageParams;

const ALL_PAGES_QUERY = {
  filters: { Draft: { $eq: false }, page: { $notIn: ["home", "board"] } },
  fields: ["documentId", "page"],
};

async function getPageData(pageSlug: string) {
  try {
    const queryParams = {
      filters: { page: { $eq: pageSlug }, Draft: { $eq: false } },
      populate: "*",
    };
    const result = await fetchStrapi<DynamicPageQueryResult>(
      "pages",
      queryParams,
    );
    if (!result?.data || result.data.length === 0) return null;
    return result.data[0];
  } catch (error) {
    console.error(`Failed to fetch page data for slug: ${pageSlug}`, error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const result = await fetchStrapi<DynamicPageQueryResult>(
      "pages",
      ALL_PAGES_QUERY,
    );

    const params: Array<{ page: string }> = [];
    if (result?.data) {
      result.data.forEach((page: PageData) => {
        if (page.page) {
          params.push({ page: page.page });
        }
      });
    }

    return params;
  } catch (error) {
    console.error("Failed to generate static params for /[page]", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: DynamicPageParamsInput;
}): Promise<Metadata> {
  const lang = "fi";
  const { page: pageSlug } = await params;
  const page = await getPageData(pageSlug);

  if (!page) {
    return { title: "Sivua ei löytynyt | Matlu ry" };
  }

  const seo = page.Seo;
  const title = seo?.metaTitle?.[lang] || page.Title?.[lang] || "";
  const description =
    seo?.metaDescription?.[lang] || page.Description?.[lang] || "";
  const canonical = seo?.canonicalUrl || `/${pageSlug}`;

  const shareImage = seo?.shareImage?.url;

  return {
    title: `${title} | Matlu ry`,
    description: description,
    alternates: {
      canonical: canonical,
      languages: {
        fi: `/${pageSlug}`,
        en: `/en/${pageSlug}`,
      },
    },
    robots: page.HideFromSearchEngine ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: title,
      description: description,
      type: "article",
      ...(shareImage && { images: [{ url: shareImage }] }),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title: title,
      description: description,
      ...(shareImage && { images: [shareImage] }),
    },
  };
}

interface DynamicPageProps {
  params: DynamicPageParamsInput;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const lang = "fi";
  const { page: pageSlug } = await params;
  const page = await getPageData(pageSlug);

  if (!page) {
    return (
      <MainLayout lang={lang}>
        <div>Sivua ei löytynyt</div>
      </MainLayout>
    );
  }

  const body = page.body.Fi || "";

  const isEventsPage = pageSlug === "events";
  const isContactPage = pageSlug === "contact";

  let locationSuggestions: LocationSuggestion[] = [];
  let titleSuggestions: TitleSuggestion[] = [];

  if (isEventsPage) {
    try {
      // Fetch suggestions server-side during build using the token-authenticated fetchStrapi
      const [locRes, titleRes] = await Promise.all([
        fetchStrapi<{ data: LocationSuggestion[] }>("event-requests/suggestions"),
        fetchStrapi<{ data: TitleSuggestion[] }>("event-requests/title-suggestions")
      ]);
      locationSuggestions = locRes.data || [];
      titleSuggestions = titleRes.data || [];
    } catch (error) {
      console.error("Failed to fetch event suggestions during build", error);
    }
  }

  const localizedLinks = {
    fi: `/${pageSlug}/`,
    en: `/en/${pageSlug}/`,
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      {isEventsPage && <h1>Tulevat tapahtumat</h1>}
      {isEventsPage && <CalendarEvents language={lang} showAll />}
      {isEventsPage && (
        <EventRequestForm
          lang={lang}
          initialLocationSuggestions={locationSuggestions}
          initialTitleSuggestions={titleSuggestions}
        />
      )}
      {isContactPage && <ContactForm lang={lang} />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </MainLayout>
  );
}
