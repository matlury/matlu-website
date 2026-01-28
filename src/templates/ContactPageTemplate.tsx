import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import ContactForm from "../components/ContactForm";
import {
  ContactPageTemplateQuery,
  ContactPageTemplatePageContext,
} from "../utils";

interface ContactPageTemplateProps {
  data: ContactPageTemplateQuery;
  pageContext: ContactPageTemplatePageContext;
}

const ContactPageTemplate: React.FC<ContactPageTemplateProps> = ({
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
      <SEO
        title={data.strapiPage.attributes.Title[pageContext.language]}
        lang={pageContext.language}
        hideFromSearchEngine={pageContext.hideFromSearchEngine}
      />
      <ContactForm lang={pageContext.language} />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || ""}</ReactMarkdown>
    </Layout>
  );
};

export default ContactPageTemplate;

export const query = graphql`
  query ($id: String!) {
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