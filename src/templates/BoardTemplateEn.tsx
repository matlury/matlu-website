import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import { SEO } from "../seo";
import {
  BoardTemplateQuery,
  LocalizedTextEn,
  BoardPageContext,
} from "../utils";

interface BoardTemplateEnProps {
  data: BoardTemplateQuery<LocalizedTextEn>;
  pageContext: BoardPageContext;
}

const BoardTemplateEn: React.FC<BoardTemplateEnProps> = ({
  data,
  pageContext,
}) => {
  const board = data.strapiBoard;
  const boardYears = pageContext.boardYears;
  return (
    <Layout language="en" localizedLinks={pageContext.localizedLinks}>
      <SEO
        title={`Board of ${board.year}`}
        lang={pageContext.language}
        hideFromSearchEngine={pageContext.hideFromSearchEngine}
      />
      <h1>Board of {board.year}</h1>
      <p>
        E-mail addresses are mostly in the form of <b>etu.suku@helsinki.fi</b>.
        <br /> You can reach the whole board from{" "}
        <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.
      </p>
      <div className="board-members">
        {board.members !== null &&
          [...board.members.sort((a, b) => a.id - b.id)].map((member) => (
            <section
              className="board-member"
              key={`board_${board.id}_member_${member.id}`}
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
      {board.officers !== null && board.officers.length > 0 && (
        <section>
          <h2>Officials of {board.year}</h2>
          <div className="officers">
            {[...board.officers.sort((a, b) => a.id - b.id)].map((officer) => (
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
        board.teams.length > 0 &&
        [...board.teams.sort((a, b) => a.id - b.id)].map((team) => (
          <section className="team" key={team.id}>
            <h2>{team.title.en}</h2>
            <ul>
              {[
                ...team.team_members
                  .filter((member) => member.name !== null)
                  .sort((a, b) => a.name.localeCompare(b.name)),
              ].map((member) => (
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
                <Link
                  to={`/en/board/${boardYear}/`}
                  activeClassName="active-board"
                >
                  {boardYear}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  );
};

export default BoardTemplateEn;

export const query = graphql`
  query BoardTemplateEn($id: String) {
    strapiBoard(id: { eq: $id }) {
      id
      year
      members {
        id
        name
        email
        role {
          id
          en
        }
      }
      officers {
        id
        name
        role {
          id
          en
        }
      }
      teams {
        id
        title {
          id
          en
        }
        team_members {
          id
          name
        }
      }
    }
  }
`;
