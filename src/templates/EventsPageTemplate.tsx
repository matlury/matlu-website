import React from "react";
import ReactMarkdown from "react-markdown";
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
}) => (
  <Layout
    language={pageContext.language}
    localizedLinks={pageContext.localizedLinks}
  >
    <h1>
      {pageContext.language === "fi" ? "Tulevat tapahtumat" : "Upcoming events"}
    </h1>
    <SEO
      title={data.strapiPage.Title[pageContext.language]}
      hideFromSearchEngine={pageContext.hideFromSearchEngine}
    />
    <CalendarEvents language={pageContext.language} showAll />
    <ReactMarkdown source={data.strapiPage.body[pageContext.language]} />
  </Layout>
);

export default EventsPageTemplate;

export const query = graphql`
  query EventsPageTemplate($id: String) {
    strapiPage(id: { eq: $id }) {
      body {
        fi: Fi
        en: En
      }
      Title {
        fi
        en
      }
    }
  }
`;
