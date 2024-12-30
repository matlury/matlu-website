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
          filter: { Draft: { eq: false }, page: { nin: ["home", "board"] } }
        ) {
          edges {
            node {
              id
              page
              HideFromSearchEngine
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  const pageData = result.data;

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

  pageData.allStrapiPage.edges.forEach(({ node }, _index) => {
    createPage({
      path: `/${node.page}/`,
      component: resolvePageTemplate(node.page),
      context: {
        id: node.id,
        language: "fi",
        localizedLinks: { en: `/en/${node.page}/` },
        hideFromSearchEngine: node.HideFromSearchEngine,
      },
    });
    createPage({
      path: `/en/${node.page}/`,
      component: resolvePageTemplate(node.page),
      context: {
        id: node.id,
        language: "en",
        localizedLinks: { fi: `/${node.page}/` },
        hideFromSearchEngine: node.HideFromSearchEngine,
      },
    });
  });

  const result2 = await graphql(
    `
      query {
        allStrapiBoard(filter: { hidden: { eq: false } }) {
          edges {
            node {
              id
              year
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
  const boardYears = boardData.allStrapiBoard.edges.map(({ node }) =>
    Number(node.year)
  );
  const latestBoard = Math.max(...boardYears);

  boardData.allStrapiBoard.edges.forEach(({ node }, _index) => {
    if (node.year === latestBoard) {
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
      path: `/board/${node.year}/`,
      component: require.resolve("./src/templates/BoardTemplateFi.tsx"),
      context: {
        id: node.id,
        boardYears,
        language: "fi",
        localizedLinks: { en: `/en/board/${node.year}/` },
        hideFromSearchEngine: false,
      },
    });
    createPage({
      path: `/en/board/${node.year}/`,
      component: require.resolve("./src/templates/BoardTemplateEn.tsx"),
      context: {
        id: node.id,
        boardYears,
        language: "en",
        localizedLinks: { fi: `/board/${node.year}/` },
        hideFromSearchEngine: false,
      },
    });
  });
};

//Breaks frontpage but otherwise good

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type StrapiDocument implements Node {
      id: ID!
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
      id: ID!
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
