import { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "../components/MainLayout";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Matlu ry",
  description: "The page you are looking for could not be found.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <MainLayout lang="fi" hideNav={true}>
      <div>
        <h1>Not found</h1>
        <p>Sorry, we couldn&apos;t find this page.</p>
        <Link href="/">Go back home</Link>
      </div>
    </MainLayout>
  );
}
