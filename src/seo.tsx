import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { Language, SEOQuery } from "./utils";

type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string }
  | { name?: undefined; property?: undefined; content?: undefined };

interface SEOProps {
  description?: string;
  lang: Language;
  meta?: MetaTag[];
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
  const { site }: SEOQuery = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
        }
      }
    }
  `);

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
          key: `description`,
          name: `description`,
          content: metaDescription,
        },
        {
          key: `og:title`,
          property: `og:title`,
          content: title,
        },
        {
          key: `og:description`,
          property: `og:description`,
          content: metaDescription,
        },
        {
          key: `og:type`,
          property: `og:type`,
          content: `website`,
        },
        {
          key: `twitter:card`,
          name: `twitter:card`,
          content: `summary`,
        },
        {
          key: `twitter:creator`,
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          key: `twitter:title`,
          name: `twitter:title`,
          content: title,
        },
        {
          key: `twitter:description`,
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          key: `google-site-verification`,
          name: "google-site-verification",
          content: "-1keAnBhcxqqJbMzTrz5PVoeVhrzgFG6DFYklqFqMzs",
        },
        ...(hideFromSearchEngine
          ? [
              {
                key: `robots`,
                name: "robots",
                content: "noindex,nofollow",
              },
            ]
          : []),
      ].concat((meta || []).map((m, i) => ({ ...m, key: `meta-${i}` })))}
      link={[
        {
          key: "google-fonts",
          href: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap",
          rel: "stylesheet",
        },
        {
          key: "all-css",
          href: "/css/all.css",
          rel: "stylesheet",
        },
      ]}
    />
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  hideFromSearchEngine: false,
};
