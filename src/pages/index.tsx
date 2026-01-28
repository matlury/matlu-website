import React from "react";

import Layout from "../components/Layout";
import { graphql, PageProps } from "gatsby";
import { SEO } from "../seo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FrontPageQuery, LocalizedRichTextFi, LocalizedTextFi } from "../utils";

const FrontPageFi: React.FC<
  PageProps<FrontPageQuery<[LocalizedTextFi, LocalizedRichTextFi]>>
> = ({ data }) => {
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
        title={data.strapiPage.Title.fi}
        description={data.strapiPage.Description.fi}
        lang="fi"
        hideFromSearchEngine={data.strapiPage.HideFromSearchEngine}
      />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {data.strapiPage.body.Fi.data.Fi || ""}
      </ReactMarkdown>
    </Layout>
  );
};

export default FrontPageFi;

export const query = graphql`
  query FrontPageFi {
    strapiPage(page: { eq: "home" }) {
      HideFromSearchEngine
      Title {
        fi
      }
      Description {
        fi
      }
      body {
        Fi {
          data {
            Fi
          }
        }
      }
    }
  }
`;