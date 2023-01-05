import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { Language, SEOQuery } from "./utils";

interface SEOProps {
  description?: string;
  lang: Language;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  title: string;
  hideFromSearchEngine: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  description,
  lang,
  meta,
  title,
  hideFromSearchEngine,
}) => {
  const { site }: SEOQuery = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: "google-site-verification",
          content: "8Im5qjwtdRS1T2VZHEe8kf3UudgPq4ES7x-XeTGdy0U",
        },
        hideFromSearchEngine
          ? {
              name: "robots",
              content: "noindex,nofollow",
            }
          : {},
      ].concat(meta)}
      link={[
        {
          href:
            "https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap",
          rel: "stylesheet",
        },
        {
          href: "/css/all.css",
          rel: "stylesheet",
        },
      ]}
      script={[]}
    />
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  hideFromSearchEngine: false,
};
