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
        },
      })
    }
    createPage({
      path: `/${node.page}`,
      component: require.resolve("./src/templates/PageTemplate.tsx"),
      context: {
        id: node.id,
        language: "fi",
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
        },
      })
    }
    createPage({
      path: `/en/${node.page}`,
      component: require.resolve("./src/templates/PageTemplate.tsx"),
      context: {
        id: node.id,
        language: "en",
      },
    })
  })
}
