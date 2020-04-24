import React from "react";

import Layout from "../components/Layout";
import { SEO } from "../seo";

const ThankYou: React.FC = () => {
  return (
    <Layout
      language="en"
      localizedLinks={{
        fi: "/",
        en: "/en/",
      }}
    >
      <SEO
        title={"Kiitos yhteydenotostasi! / Thank you for contacting!"}
        description={"Kiitos yhteydenotostasi! / Thank you for contacting!"}
        lang="fi"
        hideFromSearchEngine={true}
      />
      <h1>Kiitos yhteydenotostasi! / Thank you for contacting!</h1>
    </Layout>
  );
};

export default ThankYou;
