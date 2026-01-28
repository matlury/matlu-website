import React from "react";
import { Language } from "../../../utils";
import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "../../../components/MainLayout";

export async function generateMetadata(): Promise<Metadata> {
  const lang = "en";
  const title = "Booking Calendar";
  const description = "Matlu Klusteri booking calendar";

  return {
    title: `${title} | Matlu ry`,
    description: description,
    robots: "noindex, nofollow",
  };
}

export default function IlotaloPage() {
  const lang = "en";

  const localizedLinks = {
    fi: "/ilotalo/",
    en: "/en/ilotalo/",
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <h1>Matlu Klusteri booking calendar</h1>
      <p>
        Go to Matlu Klusteri booking calendar from this link:{" "}
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
