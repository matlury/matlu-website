/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Matlu ry`,
    description: `Helsingin yliopiston Matemaattis-luonnontieteellisten opiskelijajärjestöjen yhteistyöjärjestö`,
    author: `Matlu ry`,
    siteUrl: process.env.SITE_URL,
    recaptchaSiteKey:
      process.env.RECAPTCHA_SITE_KEY ||
      "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
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
      options: {
        apiURL: process.env.API_URL || "http://localhost:1337",
        queryLimit: 100,
        contentTypes: [`board`, `page`, `calendar-event`, `document`],
      },
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
