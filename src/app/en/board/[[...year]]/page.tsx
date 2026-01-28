import React from "react";
import Link from "next/link";
import { fetchGraphQL } from "../../../../lib/strapi";
import { Language } from "../../../../utils";
import { Metadata } from "next";
import { gql } from "@apollo/client";
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
  boards: BoardNode[];
}

const BOARD_QUERY = gql`
  query BoardQuery($year: Int) {
    boards(
      filters: { hidden: { eq: false }, year: { eq: $year } }
      sort: "year:desc"
    ) {
      documentId
      year
      members {
        id
        email
        name
        role {
          fi
          en
        }
      }
      officers {
        id
        name
        role {
          fi
          en
        }
      }
      teams {
        id
        title {
          fi
          en
        }
        team_members {
          id
          name
        }
      }
      hidden
    }
  }
`;

const ALL_BOARD_YEARS_QUERY = gql`
  query AllBoardYearsQuery {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      documentId
      year
    }
  }
`;

async function getBoardData(year?: number) {
  const variables = year ? { year } : {};
  const { data } = await fetchGraphQL<BoardQueryResult>(BOARD_QUERY, variables);
  if (!data?.boards || data.boards.length === 0) return null;
  return data.boards[0];
}

async function getAllBoardYears(): Promise<number[]> {
  const { data } = await fetchGraphQL<BoardQueryResult>(ALL_BOARD_YEARS_QUERY);
  if (!data?.boards) return [];
  return data.boards.map((board) => board.year);
}

export async function generateStaticParams() {
  const boardYears = await getAllBoardYears();
  const params: Array<{ year?: string[] }> = [];

  boardYears.forEach((year) => {
    params.push({ year: [String(year)] });
  });

  // Add the latest board (no year in path)
  params.push({});

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
            .sort((a, b) => (a.id || "").localeCompare(b.id || ""))
            .map((member) => (
              <section
                className="board-member"
                key={`board_${board.documentId}_member_${member.id}`}
              >
                <div className="member-picture"></div>
                <div className="member-name">
                  <h4>{member.name}</h4>
                </div>
                <div className="member-title">{(member.role as any)[lang]}</div>
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
              .sort((a, b) => (a.id || "").localeCompare(b.id || ""))
              .map((officer) => (
                <section
                  className="officer"
                  key={`${officer.id}_officer_${officer.name}`}
                >
                  <div className="officer-picture"></div>
                  <div className="officer-name">
                    <h4>{officer.name}</h4>
                  </div>
                  <div className="officer-title">
                    {(officer.role as any)[lang]}
                  </div>
                </section>
              ))}
          </div>
        </section>
      )}
      {board.teams !== null &&
        (board.teams || []).length > 0 &&
        [...(board.teams || [])]
          .sort((a, b) => (a.id || "").localeCompare(b.id || ""))
          .map((team) => (
            <section className="team" key={team.id}>
              <h2>{(team.title as any)[lang]}</h2>
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
