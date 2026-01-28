import type { GatsbyNode } from "gatsby";
import * as path from "path";

export const onPostBuild: GatsbyNode["onPostBuild"] = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};

interface PageNode {
  id: string;
  documentId: string;
  page: string;
  HideFromSearchEngine: boolean;
}

interface BoardNode {
  id: string;
  documentId: string;
  year: number;
}

interface QueryResult {
  allStrapiPage: {
    nodes: PageNode[];
  };
}

interface BoardQueryResult {
  allStrapiBoard: {
    nodes: BoardNode[];
  };
}

export const createPages: GatsbyNode["createPages"] = async (args) => {
  const result = await args.graphql<QueryResult>(`
    query {
      allStrapiPage(
        filter: { Draft: { eq: false }, page: { nin: ["home", "board"] } }
      ) {
        nodes {
          id
          documentId
          page
          HideFromSearchEngine
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    throw result.errors;
  }

  const pageData = result.data.allStrapiPage.nodes;

  // Custom page templates
  const contactPageTemplate = path.resolve(
    "./src/templates/ContactPageTemplate.tsx",
  );
  const eventsPageTemplate = path.resolve(
    "./src/templates/EventsPageTemplate.tsx",
  );
  const defaultPageTemplate = path.resolve("./src/templates/PageTemplate.tsx");

  /**
   * Resolves page template based on the page identifier
   * @param {string} page
   */
  const resolvePageTemplate = (page: string) => {
    if (page === "contact") {
      return contactPageTemplate;
    }
    if (page === "events") {
      return eventsPageTemplate;
    }
    return defaultPageTemplate;
  };

  pageData.forEach((node: PageNode) => {
    const { page, HideFromSearchEngine, id, documentId } = node;
    args.actions.createPage({
      path: `/${page}/`,
      component: resolvePageTemplate(page),
      context: {
        id: id,
        documentId: documentId,
        language: "fi",
        localizedLinks: { en: `/en/${page}/` },
        hideFromSearchEngine: HideFromSearchEngine,
      },
    });
    args.actions.createPage({
      path: `/en/${page}/`,
      component: resolvePageTemplate(page),
      context: {
        id: id,
        documentId: documentId,
        language: "en",
        localizedLinks: { fi: `/${page}/` },
        hideFromSearchEngine: HideFromSearchEngine,
      },
    });
  });

  const result2 = await args.graphql<BoardQueryResult>(`
    query {
      allStrapiBoard(filter: { hidden: { eq: false } }) {
        nodes {
          id
          documentId
          year
        }
      }
    }
  `);

  if (result2.errors || !result2.data) {
    throw result2.errors;
  }
  const boardData = result2.data;

  const boardYears = boardData.allStrapiBoard.nodes.map((node: BoardNode) =>
    Number(node.year),
  );
  const latestBoard = boardYears.reduce(
    (max: number, year: number) => (year > max ? year : max),
    0,
  );

  boardData.allStrapiBoard.nodes.forEach((node: BoardNode) => {
    const { year, id, documentId } = node;
    const boardTemplateFi = path.resolve(
      "./src/templates/BoardTemplateFi.tsx",
    );
    const boardTemplateEn = path.resolve(
      "./src/templates/BoardTemplateEn.tsx",
    );
    if (year === latestBoard) {
      args.actions.createPage({
        path: `/board/`,
        component: boardTemplateFi,
        context: {
          id: id,
          documentId: documentId,
          boardYears,
          language: "fi",
          localizedLinks: { en: "/en/board/" },
          hideFromSearchEngine: false,
        },
      });
      args.actions.createPage({
        path: `/en/board/`,
        component: boardTemplateEn,
        context: {
          id: id,
          documentId: documentId,
          boardYears,
          language: "en",
          localizedLinks: { fi: "/board/" },
          hideFromSearchEngine: false,
        },
      });
    }
    args.actions.createPage({
      path: `/board/${year}/`,
      component: boardTemplateFi,
      context: {
        id: id,
        documentId: documentId,
        boardYears,
        language: "fi",
        localizedLinks: { en: `/en/board/${year}/` },
        hideFromSearchEngine: false,
      },
    });
    args.actions.createPage({
      path: `/en/board/${year}/`,
      component: boardTemplateEn,
      context: {
        id: id,
        documentId: documentId,
        boardYears,
        language: "en",
        localizedLinks: { fi: `/board/${year}/` },
        hideFromSearchEngine: false,
      },
    });
  });
};
