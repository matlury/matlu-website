import Link from "next/link";
import { getBoardData, getAllBoardYears } from "../../../../lib/cms-data";
import { Metadata } from "next";
import { MainLayout } from "../../../../components/MainLayout";

export async function generateStaticParams() {
  const boardYears = await getAllBoardYears();
  const params: Array<{ year: string[] }> = [];

  boardYears.forEach((year) => {
    params.push({ year: [String(year)] });
  });

  params.push({ year: [] });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year?: string[] }>;
}): Promise<Metadata> {
  const lang = "en";
  const { year } = await params;
  const targetYear = year ? Number(year[0]) : undefined;
  const board = await getBoardData(targetYear);

  if (!board) {
    return { title: "Board Not Found | Matlu ry" };
  }

  const seo = board.Seo;
  const defaultTitle = `Board ${board.year}`;
  const title = seo?.metaTitle?.[lang] || defaultTitle;
  const description = seo?.metaDescription?.[lang] || `Board ${board.year} - Matlu ry`;
  const canonical = seo?.canonicalUrl || (targetYear ? `/en/board/${targetYear}` : "/en/board");

  const shareImage = seo?.shareImage?.url;
  const shareImageAlt = seo?.shareImage?.alternativeText || title;

  return {
    title: `${title} | Matlu ry`,
    description: description,
    alternates: {
      canonical: canonical,
      languages: {
        fi: targetYear ? `/board/${targetYear}` : "/board",
        en: targetYear ? `/en/board/${targetYear}` : "/en/board",
      },
    },
    robots: "index, follow",
    openGraph: {
      title: title,
      description: description,
      type: "website",
      ...(shareImage && {
        images: [{ url: shareImage, alt: shareImageAlt }],
      }),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title: title,
      description: description,
      creator: "Matlu ry",
      ...(shareImage && { images: [shareImage] }),
    },
  };
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ year?: string[] }>;
}) {
  const { year } = await params;
  const targetYear = year ? Number(year[0]) : undefined;

  const [board, boardYears] = await Promise.all([
    getBoardData(targetYear),
    getAllBoardYears(),
  ]);
  if (!board || !board.documentId) {
    return (
      <MainLayout
        lang="en"
        localizedLinks={{ fi: "/board/", en: "/en/board/" }}
      >
        <div>Board not found</div>
      </MainLayout>
    );
  }

  const currentYearPath = targetYear ? `${targetYear}/` : "";
  const localizedLinks = {
    fi: `/board/${currentYearPath}`,
    en: `/en/board/${currentYearPath}`,
  };
  const otherBoardYears = boardYears.filter((boardYear) => boardYear !== board.year);

  return (
    <MainLayout lang="en" localizedLinks={localizedLinks}>
      <h1>Board {board.year}</h1>
      <p
        dangerouslySetInnerHTML={{
          __html: `Email addresses are generally in the format <b>firstname.lastname@helsinki.fi</b>.<br /> The entire board can be contacted at <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.`,
        }}
      />
      <div className="board-members">
        {board.members !== null &&
          [...(board.members || [])].map((member) => (
            <section
              className="board-member"
              key={`board_${board.documentId}_member_${member.id}`}
            >
              <div className="member-picture"></div>
              <div className="member-name">
                <h4>{member.name}</h4>
              </div>
              <div className="member-title">
                {member.role.en}
              </div>
              {member.email !== null && (
                <div className="member-email">
                  <a href={"mailto:" + member.email}>{member.email}</a>
                </div>
              )}
            </section>
          ))}
      </div>
      {board.officers !== null && (board.officers || []).length > 0 && (
        <section>
          <h2>Officers {board.year}</h2>
          <div className="officers">
            {[...(board.officers || [])].map((officer) => (
              <section
                className="officer"
                key={`${officer.id}_officer_${officer.name}`}
              >
                <div className="officer-picture"></div>
                <div className="officer-name">
                  <h4>{officer.name}</h4>
                </div>
                <div className="officer-title">
                  {officer.role.en}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}
      {board.teams !== null &&
        (board.teams || []).length > 0 &&
        [...(board.teams || [])].map((team) => (
          <section className="team" key={team.id}>
            <h2>{team.title.en}</h2>
            <ul>
              {[...(team.team_members || [])]
                .filter((member) => member.name !== null)
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                .map((member) => (
                  <li key={`${team.id}_member_${member.id}`}>{member.name}</li>
                ))}
            </ul>
          </section>
        ))}
      {otherBoardYears.length > 0 && (
        <section className="former-boards">
          <h2>Previous boards</h2>
          <ul>
            {otherBoardYears.map((boardYear) => (
              <li key={`boardyear_${boardYear}_en`}>
                <Link href={`/en/board/${boardYear}/`}>{boardYear}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </MainLayout>
  );
}