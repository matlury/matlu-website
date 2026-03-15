import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGraphQL } from "../lib/strapi";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import { MainLayout } from "../components/MainLayout";

interface PageData {
  documentId: string;
  page: string;
  Title: string;
  Description: string;
  body: string;
  HideFromSearchEngine: boolean;
  Draft: boolean;
}

interface HomePageQueryResult {
  pages: PageData[];
}

const HOME_PAGE_QUERY = gql`
  query HomePageQuery($locale: I18NLocaleCode) {
    pages(filters: { page: { eq: "home" }, Draft: { eq: false } }, locale: $locale) {
      documentId
      page
      Title
      Description
      body
      HideFromSearchEngine
      Draft
    }
  }
`;

async function getHomePageData(lang: string = "fi") {
  const { data } = await fetchGraphQL<HomePageQueryResult>(HOME_PAGE_QUERY, { locale: lang });
  if (!data?.pages || data.pages.length === 0) return null;
  return data.pages[0];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = "fi";
  const page = await getHomePageData(lang);

  if (!page) {
    return {
      title: "Etusivu | Matlu ry",
    };
  }

  const title = page.Title;
  const description = page.Description;

  return {
    title: `${title} | Matlu ry`,
    description: description,
    alternates: {
      canonical: "/",
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
    },
    twitter: {
      card: "summary",
      title: title,
      description: description,
      creator: "Matlu ry",
    },
    verification: {
      google: "-1keAnBhcxqqJbMzTrz5PVoeVhrzgFG6DFYklqFqMzs",
    },
  };
}

export default async function HomePage() {
  const lang = "fi";
  const page = await getHomePageData(lang);

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

  const body = page.body || "";

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
