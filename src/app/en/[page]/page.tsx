import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGraphQL } from "../../../lib/strapi";
import { Language } from "../../../utils";
import { Metadata } from "next";
import CalendarEvents from "../../../components/CalendarEvents";
import ContactForm from "../../../components/ContactForm";
import { gql } from "@apollo/client";
import { MainLayout } from "../../../components/MainLayout";

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
  pages: PageData[];
}

const DYNAMIC_PAGE_QUERY = gql`
  query DynamicPageQuery($pageSlug: String!) {
    pages(filters: { page: { eq: $pageSlug }, Draft: { eq: false } }) {
      documentId
      page
      Title {
        fi
        en
      }
      Description {
        fi
        en
      }
      body {
        Fi
        En
      }
      HideFromSearchEngine
      Draft
    }
  }
`;

const ALL_PAGES_QUERY = gql`
  query AllPagesQuery {
    pages(
      filters: { Draft: { eq: false }, page: { notIn: ["home", "board"] } }
    ) {
      documentId
      page
    }
  }
`;

async function getPageData(pageSlug: string) {
  const { data } = await fetchGraphQL<DynamicPageQueryResult>(
    DYNAMIC_PAGE_QUERY,
    { pageSlug },
  );
  if (!data?.pages || data.pages.length === 0) return null;
  return data.pages[0];
}

export async function generateStaticParams() {
  const { data } = await fetchGraphQL<DynamicPageQueryResult>(ALL_PAGES_QUERY);

  const params: Array<{ page: string }> = [];
  if (data?.pages) {
    data.pages.forEach((page) => {
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
  const page = await getPageData(pageSlug);

  if (!page) {
    return { title: "Page Not Found | Matlu ry" };
  }

  const title = page.Title[lang];
  const description = page.Description ? page.Description[lang] : "";

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
  const page = await getPageData(pageSlug);

  if (!page) {
    return (
      <MainLayout lang={lang}>
        <div>Page not found</div>
      </MainLayout>
    );
  }

  const body = page.body.En || "";

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
