import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPageData, getAllPageSlugs } from "../../../lib/cms-data";
import { Metadata } from "next";
import ContactForm from "../../../components/ContactForm";
import EventsPageContent from "../../../components/EventsPageContent";
import { MainLayout } from "../../../components/MainLayout";
import { DEFAULT_DESCRIPTION_EN } from "../../../types/seo";

type DynamicPageParams = { page: string };
type DynamicPageParamsInput = Promise<DynamicPageParams> | DynamicPageParams;

export async function generateStaticParams() {
  try {
    const pageSlugs = await getAllPageSlugs();
    return pageSlugs.map((page) => ({ page }));
  } catch (error) {
    console.error("Failed to generate static params for /en/[page]", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: DynamicPageParamsInput;
}): Promise<Metadata> {
  const lang = "en";
  const { page: pageSlug } = await params;
  const page = await getPageData(pageSlug);

  if (!page) {
    return { title: "Page Not Found | Matlu ry" };
  }

  const seo = page.Seo;
  const title = seo?.metaTitle?.[lang] || page.Title?.[lang] || "";
  const description =
    seo?.metaDescription?.[lang] || page.Description?.[lang] || DEFAULT_DESCRIPTION_EN;
  const canonical = seo?.canonicalUrl || `/en/${pageSlug}`;

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

export default async function DynamicPage({
  params,
}: {
  params: DynamicPageParamsInput;
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

  const body = page.body?.En || "";

  const isEventsPage = pageSlug === "events";
  const isContactPage = pageSlug === "contact";

  const localizedLinks = {
    fi: `/${pageSlug}/`,
    en: `/en/${pageSlug}/`,
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      {isEventsPage && (
        <EventsPageContent
          lang={lang}
          locationSuggestions={[]}
          titleSuggestions={[]}
        />
      )}
      {isContactPage && <ContactForm lang={lang} />}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {body}
      </ReactMarkdown>
    </MainLayout>
  );
}
