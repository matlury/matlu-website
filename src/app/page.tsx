import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchGraphQL } from "../lib/strapi";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import { MainLayout } from "../components/MainLayout";

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
    }
  }
`;

async function getHomePageData() {
  const { data } = await fetchGraphQL<HomePageQueryResult>(HOME_PAGE_QUERY);
  if (!data?.pages || data.pages.length === 0) return null;
  return data.pages[0];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = "fi";
  const page = await getHomePageData();

  if (!page) {
    return {
      title: "Etusivu | Matlu ry",
    };
  }

  const title = page.Title[lang];
  const description = page.Description[lang];

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
  const page = await getHomePageData();

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
