import { Metadata } from "next";
import { MainLayout } from "../../components/MainLayout";

export function generateMetadata(): Metadata {
  const title = "Kiitos yhteydenotostasi!";

  return {
    title: `${title} | Matlu ry`,
    description: title,
    robots: "noindex, nofollow",
  };
}

export default function ThankYouPage() {
  const lang = "fi";

  const localizedLinks = {
    fi: "/thank-you/",
    en: "/en/thank-you/",
  };

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <h1>Kiitos yhteydenotostasi! / Thank you for contacting!</h1>
    </MainLayout>
  );
}
