import React from "react"

import Layout from "../../components/Layout"
import { graphql } from "gatsby"
import { SEO } from "../../seo"
import ReactMarkdown from "react-markdown"
import { FrontPageQuery, LocalizedTextEn } from "../../utils"

interface FrontPageEnProps {
  data: FrontPageQuery<LocalizedTextEn>
}

const FrontPageEn: React.FC<FrontPageEnProps> = ({ data }) => {
  if (data.strapiPage === null) {
    return (
      <Layout
        language="en"
        localizedLinks={{
          fi: "/",
          en: "/en/",
        }}
      >
        <SEO title={"Frontpage"} lang="en" hideFromSearchEngine={true} />
        <div>Front page content is empty - please create it in the CMS.</div>
      </Layout>
    )
  }
  return (
    <Layout
      language="en"
      localizedLinks={{
        fi: "/",
        en: "/en/",
      }}
    >
      <SEO
        title={data.strapiPage.Title.en}
        description={data.strapiPage.Description.en}
        lang="fi"
        hideFromSearchEngine={data.strapiPage.HideFromSearchEngine}
      />
      <ReactMarkdown source={data.strapiPage.body.en} />
    </Layout>
  )
}

export default FrontPageEn

export const query = graphql`
  query FrontPageEn {
    strapiPage(page: { eq: "home" }) {
      body {
        en: En
      }
      Title {
        en
      }
      Description {
        en
      }
      HideFromSearchEngine
    }
  }
`
