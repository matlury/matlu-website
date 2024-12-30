import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import { PageTemplateQuery, PageTemplatePageContext } from "../utils";

interface PageTemplateProps {
  data: PageTemplateQuery;
  pageContext: PageTemplatePageContext;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ data, pageContext }) => (
  <Layout
    language={pageContext.language}
    localizedLinks={pageContext.localizedLinks}
  >
    <SEO
      title={data.strapiPage.Title[pageContext.language]}
      lang={pageContext.language}
      hideFromSearchEngine={pageContext.hideFromSearchEngine}
    />
    <ReactMarkdown
      plugins={[gfm]}
      source={data.strapiPage.body[pageContext.language]}
    />
  </Layout>
);

export default PageTemplate;

export const query = graphql`
  query PageTemplate($id: String) {
  strapiPage(id: {eq: $id}) {
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
