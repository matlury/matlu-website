import React from "react";

import Layout from "../components/Layout";
import { graphql } from "gatsby";
import { SEO } from "../seo";
import ReactMarkdown from "react-markdown";
import { FrontPageQuery, LocalizedTextFi } from "../utils";

interface FrontPageFiProps {
  data: FrontPageQuery<LocalizedTextFi>;
}

const FrontPageFi: React.FC<FrontPageFiProps> = ({ data }) => {
  if (data.strapiPage === null) {
    return (
      <Layout
        language="fi"
        localizedLinks={{
          fi: "/",
          en: "/en/",
        }}
      >
        <SEO title={"Etusivu"} lang="fi" hideFromSearchEngine={true} />
        <div>Etusivun sisältö on tyhjä - ole hyvä ja luo se CMS:n avulla.</div>
      </Layout>
    );
  }
  return (
    <Layout
      language="fi"
      localizedLinks={{
        fi: "/",
        en: "/en/",
      }}
    >
      <SEO
        title={data.strapiPage.Title.fi}
        description={data.strapiPage.Description.fi}
        lang="fi"
        hideFromSearchEngine={data.strapiPage.HideFromSearchEngine}
      />
      <ReactMarkdown source={data.strapiPage.body.fi} />
    </Layout>
  );
};

export default FrontPageFi;

export const query = graphql`
  query FrontPageFi {
    strapiPage(page: { eq: "home" }) {
      body {
        fi: Fi
      }
      Title {
        fi
      }
      Description {
        fi
      }
      HideFromSearchEngine
    }
  }
`;
