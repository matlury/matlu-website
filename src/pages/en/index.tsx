import React from "react";

import Layout from "../../components/Layout";
import { graphql } from "gatsby";
import { SEO } from "../../seo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FrontPageQuery,
  LocalizedRichTextEn,
  LocalizedTextEn,
} from "../../utils";

interface FrontPageEnProps {
  data: FrontPageQuery<[LocalizedTextEn, LocalizedRichTextEn]>;
}

const FrontPageEn: React.FC<FrontPageEnProps> = ({ data }) => {
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
        title={data.strapiPage.attributes.Title.en}
        description={data.strapiPage.attributes.Description.en}
        lang="en"
        hideFromSearchEngine={data.strapiPage.attributes.HideFromSearchEngine}
      />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {data.strapiPage.attributes.body.En || ""}
      </ReactMarkdown>
    </Layout>
  );
};

export default FrontPageEn;

export const query = graphql`
  query FrontPageEn {
    strapiPage(attributes: { page: { eq: "home" } }) {
      attributes {
        HideFromSearchEngine
        Title {
          en
        }
        Description {
          en
        }
        body {
          En
        }
      }
    }
  }
`;