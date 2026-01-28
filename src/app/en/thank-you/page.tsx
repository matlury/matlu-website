import React from "react";
import { Language } from "../../../utils";
import { Metadata } from "next";
import { MainLayout } from "../../../components/MainLayout";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Thank you for contacting!";

  return {
    title: `${title} | Matlu ry`,
    description: title,
    robots: "noindex, nofollow",
  };
}

export default function ThankYouPage() {
  const lang = "en";

  const localizedLinks = {
    fi: "/thank-you/",
    en: "/en/thank-you/",
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <h1>Thank you for contacting! / Kiitos yhteydenotostasi!</h1>
    </MainLayout>
  );
}
