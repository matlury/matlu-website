import React from "react";

import Layout from "../../components/Layout";
import { graphql, PageProps } from "gatsby";
import { SEO } from "../../seo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FrontPageQuery,
  LocalizedRichTextEn,
  LocalizedTextEn,
} from "../../utils";

const FrontPageEn: React.FC<
  PageProps<FrontPageQuery<[LocalizedTextEn, LocalizedRichTextEn]>>
> = ({ data }) => {
  if (!data.strapiPage) {
    return (
      <Layout
        language="en"
        localizedLinks={{
          fi: "/",
          en: "/en/",
        }}
      >
        <SEO title={"Frontpage"} lang="en" hideFromSearchEngine={true} />
        <div>
          Front page content is empty - please create it in the content
          management system:{" "}
          <a href="https://cms.matlu.fi">https://cms.matlu.fi</a>
        </div>
      </Layout>
    );
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
        lang="en"
        hideFromSearchEngine={data.strapiPage.HideFromSearchEngine}
      />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {data.strapiPage.body.En.data.En || ""}
      </ReactMarkdown>
    </Layout>
  );
};

export default FrontPageEn;

export const query = graphql`
  query FrontPageEn {
    strapiPage(page: { eq: "home" }) {
      HideFromSearchEngine
      Title {
        en
      }
      Description {
        en
      }
      body {
        En {
          data {
            En
          }
        }
      }
    }
  }
`;