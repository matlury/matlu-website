import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGraphQL } from "../../lib/strapi";
import { Metadata } from "next";
import { gql } from "@apollo/client";
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

interface HomePageQueryResult {
  pages: PageData[];
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
  }
`;

async function getHomePageData() {
  const { data } = await fetchGraphQL<HomePageQueryResult>(HOME_PAGE_QUERY);
  if (!data?.pages || data.pages.length === 0) return null;
  return data.pages[0];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = "en";
  const page = await getHomePageData();

  if (!page) {
    return {
      title: "Home | Matlu ry",
    };
  }

  const seo = page.Seo;
  const title = seo?.metaTitle?.[lang] || page.Title?.[lang] || "";
  const description =
    seo?.metaDescription?.[lang] || page.Description?.[lang] || "";
  const canonical = seo?.canonicalUrl || "/en";

  const shareImage = seo?.shareImage?.url;

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
      ...(shareImage && { images: [{ url: shareImage }] }),
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
  const lang = "en";
  const page = await getHomePageData();

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

  const localizedLinks = {
    fi: "/",
    en: "/en/",
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </MainLayout>
  );
}
