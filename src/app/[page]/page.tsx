import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getPageData,
  getAllPageSlugs,
  getEventSuggestions,
  type LocationSuggestion,
  type TitleSuggestion,
} from "../../lib/cms-data";
import { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import EventsPageContent from "../../components/EventsPageContent";
import { MainLayout } from "../../components/MainLayout";
import { DEFAULT_DESCRIPTION_FI } from "../../types/seo";

type DynamicPageParams = { page: string };
type DynamicPageParamsInput = Promise<DynamicPageParams> | DynamicPageParams;

export async function generateStaticParams() {
  try {
    const pageSlugs = await getAllPageSlugs();
    return pageSlugs.map((page) => ({ page }));
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
    seo?.metaDescription?.[lang] || page.Description?.[lang] || DEFAULT_DESCRIPTION_FI;
  const canonical = seo?.canonicalUrl || `/${pageSlug}`;

  const shareImage = seo?.shareImage?.url;
  const shareImageAlt = seo?.shareImage?.alternativeText || title;

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
      type: "website",
      ...(shareImage && {
        images: [{ url: shareImage, alt: shareImageAlt }],
      }),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title: title,
      description: description,
      creator: "Matlu ry",
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

  const body = page.body?.Fi || "";

  const isEventsPage = pageSlug === "events";
  const isContactPage = pageSlug === "contact";

  let locationSuggestions: LocationSuggestion[] = [];
  let titleSuggestions: TitleSuggestion[] = [];

  if (isEventsPage) {
    try {
      const { locationSuggestions: loc, titleSuggestions: titles } =
        await getEventSuggestions();
      locationSuggestions = loc;
      titleSuggestions = titles;
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
      {isEventsPage && (
        <EventsPageContent
          lang={lang}
          locationSuggestions={locationSuggestions}
          titleSuggestions={titleSuggestions}
        />
      )}
      {isContactPage && <ContactForm lang={lang} />}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </MainLayout>
  );
}
