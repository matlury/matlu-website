import React from "react";
import Link from "next/link";
import { fetchGraphQL } from "../../../../lib/strapi";
import { Metadata } from "next";
import { gql } from "@apollo/client";
import { MainLayout } from "../../../../components/MainLayout";

interface BoardMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

interface Officer {
  id: string;
  name: string;
  role: string;
}

interface TeamMember {
  id: string;
  name: string;
}

interface Team {
  id: string;
  title: string;
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

interface BoardsQueryResult {
  boards: BoardNode[];
}

function getLocalesToTry(lang: string): string[] {
  return lang === "en" ? ["en", "fi"] : [lang, "en"];
}

const BOARD_BY_YEAR_QUERY = gql`
  query BoardByYear($year: Int, $locale: I18NLocaleCode) {
    boards(filters: { year: { eq: $year }, hidden: { eq: false } }, locale: $locale) {
      documentId
      year
      hidden
      members {
        id
        name
        email
        role
      }
      officers {
        id
        name
        role
      }
      teams {
        id
        title
        team_members {
          id
          name
        }
      }
    }
  }
`;

const ALL_BOARD_YEARS_QUERY = gql`
  query AllBoardYears($locale: I18NLocaleCode) {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc", locale: $locale) {
      documentId
      year
    }
  }
`;

async function getBoardData(year?: number, lang: string = "en") {
  if (!year) {
    const years = await getAllBoardYears(lang);
    if (years.length === 0) return null;
    year = years[0];
  }

  for (const locale of getLocalesToTry(lang)) {
    const { data } = await fetchGraphQL<BoardsQueryResult>(BOARD_BY_YEAR_QUERY, {
      year,
      locale,
    });

    if (data?.boards && data.boards.length > 0) {
      return data.boards[0];
    }
  }

  return null;
}

async function getAllBoardYears(lang: string = "en"): Promise<number[]> {
  for (const locale of getLocalesToTry(lang)) {
    const { data } = await fetchGraphQL<BoardsQueryResult>(ALL_BOARD_YEARS_QUERY, {
      locale,
    });

    if (data?.boards && data.boards.length > 0) {
      return data.boards.map((board) => board.year);
    }
  }

  return [];
}

export async function generateStaticParams() {
  const boardYears = await getAllBoardYears("en");
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
  const board = await getBoardData(targetYear, "en");

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
  const { year: yearParam } = await params;
  const targetYear = yearParam ? Number(yearParam[0]) : undefined;

  const board = await getBoardData(targetYear, lang);
  const boardYears = await getAllBoardYears(lang);

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
        {(board.members || []).map((member) => (
          <section
            className="board-member"
            key={`board_${board.documentId}_member_${member.id}`}
          >
            <div className="member-picture"></div>
            <div className="member-name">
              <h4>{member.name}</h4>
            </div>
            <div className="member-title">{member.role}</div>
            {member.email && (
              <div className="member-email">
                <a href={"mailto:" + member.email}>{member.email}</a>
              </div>
            )}
          </section>
        ))}
      </div>
      {board.officers && board.officers.length > 0 && (
        <section>
          <h2>Officials of {board.year}</h2>
          <div className="officers">
            {board.officers.map((officer) => (
              <section
                className="officer"
                key={`${officer.id}_officer_${officer.name}`}
              >
                <div className="officer-picture"></div>
                <div className="officer-name">
                  <h4>{officer.name}</h4>
                </div>
                <div className="officer-title">{officer.role}</div>
              </section>
            ))}
          </div>
        </section>
      )}
      {board.teams &&
        board.teams.length > 0 &&
        board.teams.map((team) => (
          <section className="team" key={team.id}>
            <h2>{team.title}</h2>
            <ul>
              {(team.team_members || [])
                .filter((member) => member.name !== null)
                .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                .map((member) => (
                  <li key={`${team.id}_member_${member.id}`}>{member.name}</li>
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
