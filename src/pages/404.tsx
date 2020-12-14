import React from "react";

import Layout from "../components/Layout";
import { SEO } from "../seo";

const NotFoundPage = () => (
  <Layout
    language="en"
    localizedLinks={{
      fi: "/",
      en: "/en",
    }}
  >
    <SEO title="404: Not found" hideFromSearchEngine lang={"en"} />
    <h1>Not found</h1>
  </Layout>
);

export default NotFoundPage;
