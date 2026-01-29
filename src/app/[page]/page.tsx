import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchStrapi } from "../../lib/strapi";
import { Metadata } from "next";
import CalendarEvents from "../../components/CalendarEvents";
import ContactForm from "../../components/ContactForm";
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
}

interface DynamicPageQueryResult {
  data: PageData[];
  meta: any;
}

const ALL_PAGES_QUERY = {
  filters: { Draft: { $eq: false }, page: { $notIn: ["home", "board"] } },
  fields: ["documentId", "page"],
};

async function getPageData(pageSlug: string) {
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
  const lang = "fi";
  const { page: pageSlug } = await params;
  const page = await getPageData(pageSlug);

  if (!page) {
    return { title: "Sivua ei löytynyt | Matlu ry" };
  }

  const title = page.Title[lang];
  const description = page.Description ? page.Description[lang] : "";

  return {
    title: `${title} | Matlu ry`,
    description: description,
    alternates: {
      canonical: `/${pageSlug}`,
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

interface DynamicPageProps {
  params: Promise<{ page: string }>;
}

const DynamicPage = async ({ params }: DynamicPageProps) => {
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

  const localizedLinks = {
    fi: `/${pageSlug}/`,
    en: `/en/${pageSlug}/`,
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      {isEventsPage && <h1>Tulevat tapahtumat</h1>}
      {isEventsPage && <CalendarEvents language={lang} showAll />}
      {isContactPage && <ContactForm lang={lang} />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>

    </MainLayout>
  );
};

export default DynamicPage;
