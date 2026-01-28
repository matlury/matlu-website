import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import { PageTemplateQuery, PageTemplatePageContext } from "../utils";

interface PageTemplateProps {
  data: PageTemplateQuery;
  pageContext: PageTemplatePageContext;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ data, pageContext }) => {
  const langKey = pageContext.language === "en" ? "En" : "Fi";
  const body = data.strapiPage.attributes.body[langKey];

  return (
    <Layout
      language={pageContext.language}
      localizedLinks={pageContext.localizedLinks}
    >
      <SEO
        title={data.strapiPage.attributes.Title[pageContext.language]}
        lang={pageContext.language}
        hideFromSearchEngine={pageContext.hideFromSearchEngine}
      />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || ""}</ReactMarkdown>
    </Layout>
  );
};
export default PageTemplate;

export const query = graphql`
  query ($documentId: Int!) {
    strapiPage(strapi_document_id_or_regular_id: { eq: $documentId }) {
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
