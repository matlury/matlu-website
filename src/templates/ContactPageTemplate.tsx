import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import { SEO } from "../SEO"
import ContactForm from "../components/ContactForm"

const ContactPageTemplate = ({ data, pageContext }) => {
  const dta = {
    body: "",
    title: "",
  }
  if (pageContext.language === "fi") {
    dta.title = data.strapiPage.Page_title_fi
    dta.body = data.strapiPage.body_fi
  } else if (pageContext.language === "en") {
    dta.title = data.strapiPage.Page_title_en
    dta.body = data.strapiPage.body_en
  }
  return (
    <Layout
      language={pageContext.language}
      localizedLinks={pageContext.localizedLinks}
    >
      <SEO title={dta.title} lang={pageContext.language} />
      <ReactMarkdown source={dta.body} />
      <ContactForm />
    </Layout>
  )
}

export default ContactPageTemplate

export const query = graphql`
  query ContactPageTemplate($id: String) {
    strapiPage(id: { eq: $id }) {
      body_fi
      body_en
      Page_title_fi
      Page_title_en
    }
  }
`
