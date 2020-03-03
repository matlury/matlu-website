import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import { SEO } from "../seo"
import ContactForm from "../components/ContactForm"

const ContactPageTemplate = ({ data, pageContext }) => (
  <Layout
    language={pageContext.language}
    localizedLinks={pageContext.localizedLinks}
  >
    <SEO
      title={data.strapiPage.Title[pageContext.language]}
      lang={pageContext.language}
    />
    <ContactForm lang={pageContext.language} />
    <ReactMarkdown source={data.strapiPage.body[pageContext.language]} />
  </Layout>
)

export default ContactPageTemplate

export const query = graphql`
  query ContactPageTemplate($id: String) {
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
`
