import Link from "next/link";
import { MainLayout } from "../components/MainLayout";

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
