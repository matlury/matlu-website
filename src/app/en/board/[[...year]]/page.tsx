import Link from "next/link";
import { fetchStrapi } from "../../../../lib/strapi";
import { Metadata } from "next";
import { MainLayout } from "../../../../components/MainLayout";

interface BoardMember {
  id: string;
  name: string;
  email: string | null;
  role: { fi: string; en: string };
}

interface Officer {
  id: string;
  name: string;
  role: { fi: string; en: string };
}

interface TeamMember {
  id: string;
  name: string;
}

interface Team {
  id: string;
  title: { fi: string; en: string };
  team_members: TeamMember[];
}

interface BoardNode {
  documentId: string;
  year: number;
  members: BoardMember[] | null;
  officers: Officer[] | null;
  teams: Team[] | null;
  hidden: boolean;
}

interface BoardQueryResult {
  data: BoardNode[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const ALL_BOARD_YEARS_QUERY = {
  filters: { hidden: { $eq: false } },
  sort: "year:desc",
  fields: ["documentId", "year"],
};

interface StrapiFilters {
  hidden?: { $eq: boolean };
  year?: { $eq: number };
}

async function getBoardData(_year?: number) {
  // For testing purposes, fetch only 2026 board
  const filters: StrapiFilters = {
    hidden: { $eq: false },
    year: { $eq: 2026 },
  };
  const queryParams = {
    filters,
    sort: "year:desc",
    populate: "*",
  };
  const result = await fetchStrapi<BoardQueryResult>("boards", queryParams);
  console.log("getBoardData (en) result:", JSON.stringify(result, null, 2));
  if (!result?.data || result.data.length === 0) return null;
  return result.data[0];
}

async function getAllBoardYears(): Promise<number[]> {
  const result = await fetchStrapi<BoardQueryResult>(
    "boards",
    ALL_BOARD_YEARS_QUERY,
  );
  console.log("getAllBoardYears (en) result:", JSON.stringify(result, null, 2));
  if (!result?.data) return [];
  return result.data.map((board: BoardNode) => board.year);
}

export async function generateStaticParams() {
  const boardYears = await getAllBoardYears();
  const params: Array<{ year: string[] }> = [];

  boardYears.forEach((year) => {
    params.push({ year: [String(year)] });
  });

  // Add the latest board (empty array for optional catch-all root)
  params.push({ year: [] });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year?: string[] }>;
}): Promise<Metadata> {
  const { year } = await params;
  const targetYear = year ? Number(year[0]) : undefined;
  const board = await getBoardData(targetYear);

  if (!board) {
    return { title: "Board Not Found | Matlu ry" };
  }

  const title = `Board of ${board.year}`;

  return {
    title: `${title} | Matlu ry`,
    robots: "index, follow",
    openGraph: {
      title: title,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: title,
    },
  };
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ year?: string[] }>;
}) {
  const lang = "en";
  const { year } = await params;
  const targetYear = year ? Number(year[0]) : undefined;

  const board = await getBoardData(targetYear);
  const boardYears = await getAllBoardYears();

  if (!board || !board.documentId) {
    return (
      <MainLayout
        lang={lang}
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

  return (
    <MainLayout lang={lang} localizedLinks={localizedLinks}>
      <h1>Board of {board.year}</h1>
      <p
        dangerouslySetInnerHTML={{
          __html: `E-mail addresses are mostly in the form of <b>etu.suku@helsinki.fi</b>.<br /> You can reach the whole board from <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.`,
        }}
      />
      <div className="board-members">
        {board.members !== null &&
          [...(board.members || [])]
            .sort((a, b) =>
              String(a.id || "").localeCompare(String(b.id || "")),
            )
            .map((member) => (
              <section
                className="board-member"
                key={`board_${board.documentId}_member_${member.id}`}
              >
                <div className="member-picture"></div>
                <div className="member-name">
                  <h4>{member.name}</h4>
                </div>
                <div className="member-title">{member.role.en}</div>
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
          <h2>Officials of {board.year}</h2>
          <div className="officers">
            {[...(board.officers || [])]
              .sort((a, b) =>
                String(a.id || "").localeCompare(String(b.id || "")),
              )
              .map((officer) => (
                <section
                  className="officer"
                  key={`${officer.id}_officer_${officer.name}`}
                >
                  <div className="officer-picture"></div>
                  <div className="officer-name">
                    <h4>{officer.name}</h4>
                  </div>
                  <div className="officer-title">{officer.role.en}</div>
                </section>
              ))}
          </div>
        </section>
      )}
      {board.teams !== null &&
        (board.teams || []).length > 0 &&
        [...(board.teams || [])]
          .sort((a, b) => String(a.id || "").localeCompare(String(b.id || "")))
          .map((team) => (
            <section className="team" key={team.id}>
              <h2>{team.title.en}</h2>
              <ul>
                {[...(team.team_members || [])]
                  .filter((member) => member.name !== null)
                  .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                  .map((member) => (
                    <li key={`${team.id}_member_${member.id}`}>
                      {member.name}
                    </li>
                  ))}
              </ul>
            </section>
          ))}
      {boardYears.length > 0 && (
        <section className="former-boards">
          <h2>Former and other boards</h2>
          <ul>
            {boardYears.map((boardYear) => (
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
