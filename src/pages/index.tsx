import React from "react";

import Layout from "../components/Layout";
import { graphql } from "gatsby";
import { SEO } from "../seo";
import ReactMarkdown from "react-markdown";
import { FrontPageQuery, LocalizedRichTextFi, LocalizedTextFi } from "../utils";

interface FrontPageFiProps {
  data: FrontPageQuery<[LocalizedTextFi, LocalizedRichTextFi]>;
}

const FrontPageFi: React.FC<FrontPageFiProps> = ({ data }) => {
  if (!data.strapiPage) {
    return (
      <Layout
        language="fi"
        localizedLinks={{
          fi: "/",
          en: "/en/",
        }}
      >
        <SEO title={"Etusivu"} lang="fi" hideFromSearchEngine={true} />
        <div>
          Etusivun sisältö on tyhjä - ole hyvä ja luo se sisällönhallinnan
          avulla: <a href="https://cms.matlu.fi">https://cms.matlu.fi</a>
        </div>
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
        title={data.strapiPage.attributes.Title.fi}
        description={data.strapiPage.attributes.Description.fi}
        lang="fi"
        hideFromSearchEngine={data.strapiPage.attributes.HideFromSearchEngine}
      />
      <ReactMarkdown>{data.strapiPage.attributes.body.Fi}</ReactMarkdown>
    </Layout>
  );
};

export default FrontPageFi;

export const query = graphql`
  query FrontPageFi {
    strapiPage(attributes: { page: { eq: "home" } }) {
      attributes {
        HideFromSearchEngine
        Title {
          fi
        }
        Description {
          fi
        }
        body {
          Fi
        }
      }
    }
  }
`;