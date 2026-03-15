import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchStrapi } from "../../../lib/strapi";
import { Metadata } from "next";
import CalendarEvents from "../../../components/CalendarEvents";
import ContactForm from "../../../components/ContactForm";
import { MainLayout } from "../../../components/MainLayout";

interface PageData {
  documentId: string;
  page: string;
  Title: string;
  Description: string;
  body: string;
  HideFromSearchEngine: boolean;
  Draft: boolean;
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

const ALL_PAGES_QUERY = {
  filters: { Draft: { $eq: false }, page: { $notIn: ["home", "board"] } },
  fields: ["documentId", "page"],
  locale: "en",
};

async function getPageData(pageSlug: string, lang: string = "en") {
  const queryParams = {
    filters: { page: { $eq: pageSlug }, Draft: { $eq: false } },
    locale: lang,
    populate: "*",
  };
  const result = await fetchStrapi<DynamicPageQueryResult>(
    "pages",
    queryParams,
  );
  if (!result?.data || result.data.length === 0) return null;
  return result.data[0];
}

export async function generateStaticParams() {
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
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const lang = "en";
  const { page: pageSlug } = await params;
  const page = await getPageData(pageSlug, lang);

  if (!page) {
    return { title: "Page Not Found | Matlu ry" };
  }

  const title = page.Title;
  const description = page.Description || "";

  return {
    title: `${title} | Matlu ry`,
    description: description,
    alternates: {
      canonical: `/en/${pageSlug}`,
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
    },
    twitter: {
      card: "summary",
      title: title,
      description: description,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const lang = "en";
  const { page: pageSlug } = await params;
  const page = await getPageData(pageSlug, lang);

  if (!page) {
    return (
      <MainLayout lang={lang}>
        <div>Page not found</div>
      </MainLayout>
    );
  }

  const body = page.body || "";

  const isEventsPage = pageSlug === "events";
  const isContactPage = pageSlug === "contact";

  const localizedLinks = {
    fi: `/${pageSlug}/`,
    en: `/en/${pageSlug}/`,
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      {isEventsPage && <h1>Upcoming events</h1>}
      {isEventsPage && <CalendarEvents language={lang} showAll />}
      {isContactPage && <ContactForm lang={lang} />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </MainLayout>
  );
}
