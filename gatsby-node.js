/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      query {
        allStrapiPage(
          filter: {
            attributes: { Draft: { eq: false }, page: { nin: ["home", "board"] } }
          }
        ) {
          edges {
            node {
              id
              attributes {
                page
                HideFromSearchEngine
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  const pageData = result.data.allStrapiPage.edges;

  // Custom page templates
  const contactPageTemplate = require.resolve(
    "./src/templates/ContactPageTemplate.tsx"
  );
  const eventsPageTemplate = require.resolve(
    "./src/templates/EventsPageTemplate.tsx"
  );
  const defaultPageTemplate = require.resolve(
    "./src/templates/PageTemplate.tsx"
  );

  /**
   * Resolves page template based on the page identifier
   * @param {*} page
   */
  const resolvePageTemplate = (page) => {
    if (page === "contact") {
      return contactPageTemplate;
    }
    if (page === "events") {
      return eventsPageTemplate;
    }
    return defaultPageTemplate;
  };

  pageData.forEach(({ node }) => {
    const { page, HideFromSearchEngine } = node.attributes;
    createPage({
      path: `/${page}/`,
      component: resolvePageTemplate(page),
      context: {
        id: node.id,
        language: "fi",
        localizedLinks: { en: `/en/${page}/` },
        hideFromSearchEngine: HideFromSearchEngine,
      },
    });
    createPage({
      path: `/en/${page}/`,
      component: resolvePageTemplate(page),
      context: {
        id: node.id,
        language: "en",
        localizedLinks: { fi: `/${page}/` },
        hideFromSearchEngine: HideFromSearchEngine,
      },
    });
  });

  const result2 = await graphql(
    `
      query {
        allStrapiBoard(filter: { attributes: { hidden: { eq: false } } }) {
          edges {
            node {
              id
              attributes {
                year
              }
            }
          }
        }
      }
    `
  );

  if (result2.errors) {
    throw result2.errors;
  }

  const boardData = result2.data;
  /** @type {number[]} */
  const boardYears = boardData.allStrapiBoard.edges.map(({ node }) =>
    Number(node.attributes.year)
  );
  const latestBoard = boardYears.reduce(
    (max, year) => (year > max ? year : max),
    0
  );

  boardData.allStrapiBoard.edges.forEach(({ node }, _index) => {
    const { year } = node.attributes;
    if (year === latestBoard) {
      createPage({
        path: `/board/`,
        component: require.resolve("./src/templates/BoardTemplateFi.tsx"),
        context: {
          id: node.id,
          boardYears,
          language: "fi",
          localizedLinks: { en: "/en/board/" },
          hideFromSearchEngine: false,
        },
      });
      createPage({
        path: `/en/board/`,
        component: require.resolve("./src/templates/BoardTemplateEn.tsx"),
        context: {
          id: node.id,
          boardYears,
          language: "en",
          localizedLinks: { fi: "/board/" },
          hideFromSearchEngine: false,
        },
      });
    }
    createPage({
      path: `/board/${year}/`,
      component: require.resolve("./src/templates/BoardTemplateFi.tsx"),
      context: {
        id: node.id,
        boardYears,
        language: "fi",
        localizedLinks: { en: `/en/board/${year}/` },
        hideFromSearchEngine: false,
      },
    });
    createPage({
      path: `/en/board/${year}/`,
      component: require.resolve("./src/templates/BoardTemplateEn.tsx"),
      context: {
        id: node.id,
        boardYears,
        language: "en",
        localizedLinks: { fi: `/board/${year}/` },
        hideFromSearchEngine: false,
      },
    });
  });
};

//Breaks frontpage but otherwise good
/*
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type StrapiDocument implements Node {
      documentId: ID!
      title: StrapiDocumentTitle
      file: File
    }
    type StrapiDocumentTitle {
      fi: String
      en: String
    }
    type Body {
      Fi: String
      En: String
      fi: String
      en: String
    }
    type Title {
      fi: String
      en: String
    }
    type Description {
      en: String
      fi: String
    }
    type StrapiPage implements Node {
      documentId: ID!
      page: String
      Draft: Boolean
      HideFromSearchEngine: Boolean
      body: Body
      Title: Title
      Description: Description
      Ordering: Int
    }
  `);
};
*/