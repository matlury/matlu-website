/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const strapiConfig = {
  version: 4, // Strapi version 4 or 5
  apiURL: process.env.API_URL || "http://localhost:1337",
  collectionTypes: [`board`, `page`, `calendar-event`, `document`],
  singleTypes: [],
};

module.exports = {
  siteMetadata: {
    title: `Matlu ry`,
    description: `Helsingin yliopiston Matemaattis-luonnontieteellisten opiskelijajärjestöjen yhteistyöjärjestö Matlu`,
    author: `Matlu ry`,
    recaptchaSiteKey: process.env.GATSBY_RECAPTCHA_SITE_KEY || "",
    siteUrl: process.env.SITE_URL || `localhost:${8000}`,
    feedbackFormHandler: process.env.FEEDBACK_FORM_HANDLER_URL || "",
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Matlu ry`,
        short_name: `Matlu ry`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/matlu.png`,
      },
    },
    {
      resolve: `gatsby-source-strapi`,
      options: strapiConfig,
    },
    {
      resolve: `gatsby-plugin-recaptcha`,
      options: {
        async: true,
        defer: false,
      },
    },
    `gatsby-plugin-catch-links`,
  ],
};
