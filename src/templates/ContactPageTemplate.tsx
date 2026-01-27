import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
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
}) => (
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
    <ReactMarkdown
      plugins={[gfm]}
      source={data.strapiPage.body[pageContext.language].data[pageContext.language]}
    />
  </Layout>
);

export default ContactPageTemplate;

export const query = graphql`
  query ContactPageTemplate($id: String) {
      strapiPage(id: {eq: $id}) {
    Title {
      fi
      en
    }
    body {
      en: En {
        data {
          en: En
        }
      } 
      fi: Fi {
        data {
          fi: Fi
        }
      }
    }
  }
  }
`;
