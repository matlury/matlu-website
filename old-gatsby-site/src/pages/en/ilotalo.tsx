import React from "react";

import Layout from "../../components/Layout";
import { SEO } from "../../seo";

const IlotaloEn: React.FC = () => {
  return (
    <Layout
      language="en"
      localizedLinks={{
        fi: "/ilotalo",
        en: "/en/ilotalo",
      }}
    >
      <SEO
        title={"Reservation calendar"}
        description={"Matlu Klusteri reservations calendar"}
        lang="en"
        hideFromSearchEngine={true}
      />
      <h1>Matlu Klusteri reservations calendar</h1>
      <p>
        Visit Matlu Klusteri reservations calendar by clicking this link:{" "}
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

export default IlotaloEn;
