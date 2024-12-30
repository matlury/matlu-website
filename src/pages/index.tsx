import React from "react";

import Layout from "../components/Layout";
import { graphql } from "gatsby";
import { SEO } from "../seo";
import ReactMarkdown from "react-markdown";
import {  FrontPageQuery, LocalizedRichTextFi, LocalizedTextFi } from "../utils";

interface FrontPageFiProps {
  data: FrontPageQuery<[LocalizedTextFi, LocalizedRichTextFi]>;
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
        <div>
          Etusivun sisältö on tyhjä - ole hyvä ja luo se sisällönhallinnan
          avulla: <a href="https://cms.matlu.fi">https://cms.matlu.fi</a>
        </div>
      </Layout>
    );
  }
  console.log(data.strapiPage);
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
      <ReactMarkdown>{data.strapiPage.body.fi.data.fi}</ReactMarkdown>
    </Layout>
  );
};

export default FrontPageFi;

export const query = graphql`
  query FrontPageFi {
  strapiPage(page: {eq: "home"}) {
    HideFromSearchEngine
    Title {
      fi
    }
    Description {
      fi
    }
    body {
      fi: Fi {
        data {
          fi: Fi
        }
      }
    }
  }
  }
`;
