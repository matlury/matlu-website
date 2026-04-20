import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGraphQL } from "../lib/strapi";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { MainLayout } from "../components/MainLayout";
import CalendarEventsStatic from "../components/CalendarEventsStatic";
import { SeoFields, DEFAULT_DESCRIPTION_FI } from "../types/seo";

interface CalendarEventData {
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
  Seo?: SeoFields;
}

interface HomePageQueryResult {
  pages: PageData[];
  calendarEvents: CalendarEventData[];
}

async function getHomePageData() {
  const { data } = await fetchGraphQL<HomePageQueryResult>(HOME_PAGE_QUERY);
  if (!data?.pages || data.pages.length === 0) return { page: null, events: [] };
  return { page: data.pages[0], events: data.calendarEvents || [] };
}

const HOME_PAGE_QUERY = gql`
  query HomePageQuery {
    pages(filters: { page: { eq: "home" }, Draft: { eq: false } }) {
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
      Seo {
        metaTitle {
          fi
          en
        }
        metaDescription {
          fi
          en
        }
        shareImage {
          url
          alternativeText
        }
        canonicalUrl
      }
    }
    calendarEvents(filters: { hidden: { eq: false } }, sort: "start_date:asc") {
      documentId
      start_date
      end_date
      title {
        fi
        en
      }
      location {
        fi
        en
      }
      description {
        fi
        en
      }
      organizer_name
      price
      event_link
      hide_location
      location_coordinates
      hidden
    }
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  const lang = "fi";
  const { page } = await getHomePageData();

  if (!page) {
    return {
      title: "Etusivu | Matlu ry",
    };
  }

  const seo = page.Seo;
  const title = seo?.metaTitle?.[lang] || page.Title?.[lang] || "";
  const description =
    seo?.metaDescription?.[lang] || page.Description?.[lang] || DEFAULT_DESCRIPTION_FI;
  const canonical = seo?.canonicalUrl || "/";

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
  };
}

export default async function HomePage() {
  const lang = "fi";
  const { page, events } = await getHomePageData();

  if (!page) {
    return (
      <MainLayout lang={lang}>
        <div>
          Etusivun sisältö on tyhjä - ole hyvä ja luo se sisällönhallinnan
          avulla: <a href="https://cms.matlu.fi">https://cms.matlu.fi</a>
        </div>
      </MainLayout>
    );
  }

  const body = page.body.Fi || "";
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
