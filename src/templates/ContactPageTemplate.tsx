import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import ContactForm from "../components/ContactForm";
import {
  ContactPageTemplateQuery,
  ContactPageTemplatePageContext,
  LocalizedRichTextEn,
  LocalizedRichTextFi,
} from "../utils";

const ContactPageTemplate: React.FC<
  PageProps<ContactPageTemplateQuery, ContactPageTemplatePageContext>
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
      <SEO
        title={data.strapiPage.Title[pageContext.language]}
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
  query ($documentId: String!) {
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
