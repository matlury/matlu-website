import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import CalendarEvents from "../components/CalendarEvents";
import {
  EventsPageTemplateQuery,
  EventsPageTemplatePageContext,
  LocalizedRichTextEn,
  LocalizedRichTextFi,
} from "../utils";

const EventsPageTemplate: React.FC<
  PageProps<EventsPageTemplateQuery, EventsPageTemplatePageContext>
> = ({ data, pageContext }) => {
  const langKey = pageContext.language === "en" ? "En" : "Fi";
  const bodyData = data.strapiPage.body[langKey];
  const body =
    langKey === "En"
      ? (bodyData as LocalizedRichTextEn["En"]).data.En
      : (bodyData as LocalizedRichTextFi["Fi"]).data.Fi;

  return (
    <Layout
      language={pageContext.language}
      localizedLinks={pageContext.localizedLinks}
    >
      <h1>
        {pageContext.language === "fi"
          ? "Tulevat tapahtumat"
          : "Upcoming events"}
      </h1>
      <SEO
        lang={pageContext.language}
        title={data.strapiPage.Title[pageContext.language]}
        hideFromSearchEngine={pageContext.hideFromSearchEngine}
      />
      <CalendarEvents language={pageContext.language} showAll />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || ""}</ReactMarkdown>
    </Layout>
  );
};

export default EventsPageTemplate;

export const query = graphql`
  query EventsPageTemplate($documentId: String!) {
    strapiPage(documentId: { eq: $documentId }) {
      Title {
        fi
        en
      }
      body {
        En {
          data {
            En
          }
        }
        Fi {
          data {
            Fi
          }
        }
      }
    }
  }
`;
