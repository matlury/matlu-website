import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getHomePageData } from "../../lib/cms-data";
import { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import { MainLayout } from "../../components/MainLayout";
import CalendarEventsStatic from "../../components/CalendarEventsStatic";
import { DEFAULT_DESCRIPTION_EN } from "../../types/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = "en";
  const { page } = await getHomePageData();

  if (!page) {
    return {
      title: "Home | Matlu ry",
    };
  }

  const seo = page.Seo;
  const title = seo?.metaTitle?.[lang] || page.Title?.[lang] || "";
  const description =
    seo?.metaDescription?.[lang] || page.Description?.[lang] || DEFAULT_DESCRIPTION_EN;
  const canonical = seo?.canonicalUrl || "/en";

  const shareImage = seo?.shareImage?.url;
  const shareImageAlt = seo?.shareImage?.alternativeText || title;

  return {
    title: `${title} | Matlu ry`,
    description: description,
    alternates: {
      canonical: canonical,
      languages: {
        fi: "/",
        en: "/en",
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
    verification: {
      google: "-1keAnBhcxqqJbMzTrz5PVoeVhrzgFG6DFYklqFqMzs",
    },
    keywords: [
      "Matlu",
      "University of Helsinki",
      "faculty organization",
      "science students",
      "Faculty of Science",
      "Kumpula",
      "advocacy",
      "subject organizations",
    ],
  };
}

export default async function HomePage() {
  const lang = "en";
  const { page, events } = await getHomePageData();

  if (!page) {
    return (
      <MainLayout lang={lang}>
        <div>
          Home page content is empty - please create it using the CMS:{" "}
          <a href="https://cms.matlu.fi">https://cms.matlu.fi</a>
        </div>
      </MainLayout>
    );
  }

  const body = page.body.En || "";
  const marker = "<!-- CALENDAR_EVENTS -->";
  const markerIndex = body.indexOf(marker);
  let beforeContent = body;
  let afterContent = "";

  if (markerIndex !== -1) {
    beforeContent = body.slice(0, markerIndex);
    afterContent = body.slice(markerIndex + marker.length);
  }

  const localizedLinks = {
    fi: "/",
    en: "/en/",
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{beforeContent}</ReactMarkdown>
      <Box style={{ float: "right", width: "21rem", marginLeft: "2rem", marginBottom: "1rem" }}>
        <CalendarEventsStatic language={lang} events={events} />
      </Box>
      {afterContent && <ReactMarkdown remarkPlugins={[remarkGfm]}>{afterContent}</ReactMarkdown>}
    </MainLayout>
  );
}
