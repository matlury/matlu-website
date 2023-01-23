import React from "react";

import Layout from "../components/Layout";
import { SEO } from "../seo";

const IlotaloFi: React.FC = () => {
  return (
    <Layout
      language="fi"
      localizedLinks={{
        fi: "/ilotalo",
        en: "/en/ilotalo",
      }}
    >
      <SEO
        title={"Varauskalenteri"}
        description={"Matlu Klusterin varauskalenteri"}
        lang="fi"
        hideFromSearchEngine={true}
      />
      <h1>Matlu Klusterin varauskalenteri</h1>
      <p>
        Siirry Matlu Klusterin varauskalenteriin tästä linkistä:{" "}
        <a
          href="https://ilotalo.matlu.fi"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ilotalo.matlu.fi
        </a>
        .
      </p>
    </Layout>
  );
};

export default IlotaloFi;
