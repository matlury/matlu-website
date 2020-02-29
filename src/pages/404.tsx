import React from "react"

import Layout from "../components/layout"
import { SEO } from "../SEO"

const NotFoundPage = () => (
  <Layout language="en" localizedLinks={{}}>
    <SEO title="404: Not found" />
    <h1>Not found</h1>
  </Layout>
)

export default NotFoundPage
