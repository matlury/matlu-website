exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`)
}
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(
    `
      query {
        allStrapiPage {
          edges {
            node {
              id
              page
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const pageData = result.data
  pageData.allStrapiPage.edges.forEach(({ node }, index) => {
    if (node.page === "home") {
      createPage({
        path: `/`,
        component: require.resolve("./src/templates/PageTemplate.tsx"),
        context: {
          id: node.id,
          language: "fi",
          localizedLinks: { en: `/en` },
        },
      })
    }
    createPage({
      path: `/${node.page}`,
      component: require.resolve("./src/templates/PageTemplate.tsx"),
      context: {
        id: node.id,
        language: "fi",
        localizedLinks: { en: `/en/${node.page}` },
      },
    })
  })
  pageData.allStrapiPage.edges.forEach(({ node }, index) => {
    if (node.page === "home") {
      createPage({
        path: `/en`,
        component: require.resolve("./src/templates/PageTemplate.tsx"),
        context: {
          id: node.id,
          language: "fi",
          localizedLinks: { fi: `/` },
        },
      })
    }
    createPage({
      path: `/en/${node.page}`,
      component: require.resolve("./src/templates/PageTemplate.tsx"),
      context: {
        id: node.id,
        language: "en",
        localizedLinks: { fi: `/${node.page}` },
      },
    })
  })

  const result2 = await graphql(
    `
      query {
        allStrapiBoard {
          edges {
            node {
              id
              year
            }
          }
        }
      }
    `
  )

  if (result2.errors) {
    throw result2.errors
  }

  const boardData = result2.data
  const boardYears = boardData.allStrapiBoard.edges.map(({ node }) =>
    Number(node.year)
  )
  const latestBoard = Math.max(...boardYears)

  boardData.allStrapiBoard.edges.forEach(({ node }, index) => {
    if (node.year === latestBoard) {
      createPage({
        path: `/board`,
        component: require.resolve("./src/templates/BoardTemplateFi.tsx"),
        context: {
          id: node.id,
          boardYears,
          language: "fi",
          localizedLinks: { en: "/en/board" },
        },
      })
      createPage({
        path: `/en/board`,
        component: require.resolve("./src/templates/BoardTemplateEn.tsx"),
        context: {
          id: node.id,
          boardYears,
          language: "en",
          localizedLinks: { fi: "/board" },
        },
      })
    }
    createPage({
      path: `/board/` + node.year,
      component: require.resolve("./src/templates/BoardTemplateFi.tsx"),
      context: {
        id: node.id,
        boardYears,
        language: "fi",
        localizedLinks: { en: "/en/board/" + node.year },
      },
    })
    createPage({
      path: `/en/board/` + node.year,
      component: require.resolve("./src/templates/BoardTemplateEn.tsx"),
      context: {
        id: node.id,
        boardYears,
        language: "en",
        localizedLinks: { fi: "/board/" + node.year },
      },
    })
  })
}
