import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "../../components/MainLayout";

export function generateMetadata(): Metadata {
  const title = "Varauskalenteri";
  const description = "Matlu Klusterin varauskalenteri";

  return {
    title: `${title} | Matlu ry`,
    description: description,
    robots: "noindex, nofollow",
  };
}

export default function IlotaloPage() {
  const lang = "fi";

  const localizedLinks = {
    fi: "/ilotalo/",
    en: "/en/ilotalo/",
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <h1>Matlu Klusterin varauskalenteri</h1>
      <p>
        Siirry Matlu Klusterin varauskalenteriin tästä linkistä:{" "}
        <Link
          href="https://ilotalo.matlu.fi"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ilotalo.matlu.fi
        </Link>
        .
      </p>
    </MainLayout>
  );
}
