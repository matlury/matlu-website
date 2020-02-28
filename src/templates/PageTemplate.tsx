import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Layout from "../components/Layout"

const PageTemplate = ({ data, pageContext }) => {
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
    <Layout>
      <SEO title={dta.title} lang={pageContext.language} />
      <ReactMarkdown source={dta.body} />
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query PageTemplate($id: String) {
    strapiPage(id: { eq: $id }) {
      body_fi
      body_en
      Page_title_fi
      Page_title_en
    }
  }
`
