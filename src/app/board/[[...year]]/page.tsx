import React from "react";
import Link from "next/link";
import { fetchGraphQL } from "../../../lib/strapi";
import { Metadata } from "next";
import { MainLayout } from "../../../components/MainLayout";
import { gql } from "@apollo/client";

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
  Seo?: {
    metaTitle?: { fi: string; en: string };
    metaDescription?: { fi: string; en: string };
    shareImage?: {
      url: string;
      alternativeText?: string;
    };
    canonicalUrl?: string;
  };
}

interface BoardQueryResult {
  boards: BoardNode[];
}

const BOARD_QUERY = gql`
  query BoardQuery($year: Int) {
    boards(filters: { hidden: { eq: false }, year: { eq: $year } }, sort: "year:desc") {
      documentId
      year
      hidden
      members(pagination: { page: 1, pageSize: 100 }) {
        id
        name
        email
        role {
          fi
          en
        }
      }
      officers(pagination: { page: 1, pageSize: 100 }) {
        id
        name
        role {
          fi
          en
        }
      }
      teams(pagination: { page: 1, pageSize: 100 }) {
        id
        title {
          fi
          en
        }
        team_members(pagination: { page: 1, pageSize: 100 }) {
          id
          name
        }
      }
      Seo {
        metaTitle {
          fi
          en
        }
        metaDescription {
          fi
          en
        }
        shareImage {
          url
          alternativeText
        }
        canonicalUrl
      }
    }
  }
`;

const LATEST_BOARD_QUERY = gql`
  query LatestBoardQuery {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      documentId
      year
      hidden
      members(pagination: { page: 1, pageSize: 100 }) {
        id
        name
        email
        role {
          fi
          en
        }
      }
      officers(pagination: { page: 1, pageSize: 100 }) {
        id
        name
        role {
          fi
          en
        }
      }
      teams(pagination: { page: 1, pageSize: 100 }) {
        id
        title {
          fi
          en
        }
        team_members(pagination: { page: 1, pageSize: 100 }) {
          id
          name
        }
      }
      Seo {
        metaTitle {
          fi
          en
        }
        metaDescription {
          fi
          en
        }
        shareImage {
          url
          alternativeText
        }
        canonicalUrl
      }
    }
  }
`;

const ALL_BOARD_YEARS_QUERY = gql`
  query AllBoardYearsQuery {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      year
    }
  }
`;

interface BoardYearsQueryResult {
  boards: Array<{ year: number }>;
}

async function getBoardData(year?: number) {
  try {
    if (year !== undefined) {
      const { data } = await fetchGraphQL<BoardQueryResult>(BOARD_QUERY, {
        year,
      });
      if (!data?.boards || data.boards.length === 0) return null;
      return data.boards[0];
    }

    const { data } = await fetchGraphQL<BoardQueryResult>(LATEST_BOARD_QUERY);
    if (!data?.boards || data.boards.length === 0) return null;
    return data.boards[0];
  } catch (error) {
    console.error("Failed to fetch board data", error);
    return null;
  }
}

async function getAllBoardYears(): Promise<number[]> {
  try {
    const { data } = await fetchGraphQL<BoardYearsQueryResult>(
      ALL_BOARD_YEARS_QUERY,
    );
    if (!data?.boards) return [];
    return data.boards.map((board) => board.year);
  } catch (error) {
    console.error("Failed to fetch board years", error);
    return [];
  }
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
  const lang = "fi";
  const { year } = await params;
  const targetYear = year ? Number(year[0]) : undefined;
  const board = await getBoardData(targetYear);

  if (!board) {
    return { title: "Hallitusta ei löytynyt | Matlu ry" };
  }

  const seo = board.Seo;
  const defaultTitle = `Hallitus ${board.year}`;
  const title = seo?.metaTitle?.[lang] || defaultTitle;
  const description = seo?.metaDescription?.[lang] || "";
  const canonical = seo?.canonicalUrl || (targetYear ? `/board/${targetYear}` : "/board");

  const shareImage = seo?.shareImage?.url;

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
      ...(shareImage && { images: [{ url: shareImage }] }),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title: title,
      description: description,
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
        lang="fi"
        localizedLinks={{ fi: "/board/", en: "/en/board/" }}
      >
        <div>Hallitusta ei löytynyt</div>
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
    <MainLayout lang="fi" localizedLinks={localizedLinks}>
      <h1>Hallitus {board.year}</h1>
      <p
        dangerouslySetInnerHTML={{
          __html: `Sähköpostit pääsääntöisesti muotoa <b>etu.suku@helsinki.fi</b>.<br /> Koko hallitukseen saa yhteyden osoitteesta <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.`,
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
                {(member.role as { fi: string; en: string }).fi}
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
          <h2>Virkailijat {board.year}</h2>
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
                  {(officer.role as { fi: string; en: string }).fi}
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
            <h2>{(team.title as { fi: string; en: string }).fi}</h2>
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
          <h2>Aiemmat ja muut hallitukset</h2>
          <ul>
            {otherBoardYears.map((boardYear) => (
              <li key={`boardyear_${boardYear}_fi`}>
                <Link href={`/board/${boardYear}/`}>{boardYear}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </MainLayout>
  );
}
