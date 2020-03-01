import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import { SEO } from "../SEO"
import CalendarEvents from "../components/CalendarEvents"

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
    <Layout
      language={pageContext.language}
      localizedLinks={pageContext.localizedLinks}
    >
      <h1>
        {pageContext.language === "fi"
          ? "Tulevat tapahtumat"
          : "Upcoming events"}
      </h1>
      <SEO title={dta.title} lang={pageContext.language} />
      <CalendarEvents language={pageContext.language} showAll />
      <ReactMarkdown source={dta.body} />
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query EventsPageTemplate($id: String) {
    strapiPage(id: { eq: $id }) {
      body_fi
      body_en
      Page_title_fi
      Page_title_en
    }
  }
`
