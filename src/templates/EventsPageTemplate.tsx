import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import CalendarEvents from "../components/CalendarEvents";
import {
  EventsPageTemplateQuery,
  EventsPageTemplatePageContext,
} from "../utils";

interface EventsPageTemplateProps {
  data: EventsPageTemplateQuery;
  pageContext: EventsPageTemplatePageContext;
}

const EventsPageTemplate: React.FC<EventsPageTemplateProps> = ({
  data,
  pageContext,
}) => {
  const langKey = pageContext.language === "en" ? "En" : "Fi";
  const body = data.strapiPage.attributes.body[langKey];

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
        title={data.strapiPage.attributes.Title[pageContext.language]}
        hideFromSearchEngine={pageContext.hideFromSearchEngine}
      />
      <CalendarEvents language={pageContext.language} showAll />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || ""}</ReactMarkdown>
    </Layout>
  );
};

export default EventsPageTemplate;

export const query = graphql`
  query EventsPageTemplate($id: String) {
    strapiPage(id: { eq: $id }) {
      attributes {
        Title {
          fi
          en
        }
        body {
          En
          Fi
        }
      }
    }
  }
`;