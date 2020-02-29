import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import { SEO } from "../SEO"

const BoardTemplateFi: React.FC<any> = ({ data, pageContext }) => {
  const board = data.strapiBoard
  const boardYears = pageContext.boardYears
  return (
    <Layout language="fi" localizedLinks={pageContext.localizedLinks}>
      <SEO title={"Hallitus " + board.year} lang={pageContext.language} />
      <h1>Hallitus {board.year}</h1>
      <p>
        Sähköpostit pääsääntöisesti muotoa <b>etu.suku@helsinki.fi</b>.<br />{" "}
        Koko hallitukseen saa yhteyden osoitteesta{" "}
        <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.
      </p>
      <div className="board-members">
        {[...board.members.sort((a, b) => a.id - b.id)].map(member => (
          <section
            className="board-member"
            key={"board_member_" + member.name + "_" + member.id}
          >
            <div className="member-picture"></div>
            <div className="member-name">
              <h4>{member.name}</h4>
            </div>
            <div className="member-title">{member.role.fi}</div>
            {member.email !== null && (
              <div className="member-email">
                <a href={"mailto:" + member.email}>{member.email}</a>
              </div>
            )}
          </section>
        ))}
      </div>
      {board.officers.length > 0 && (
        <section>
          <h2>Virkailijat {board.year}</h2>
          <div className="officers">
            {[...board.officers.sort((a, b) => a.id - b.id)].map(officer => (
              <section
                className="officer"
                key={"officer_" + officer.name + "_" + officer.id}
              >
                <div className="officer-picture"></div>
                <div className="officer-name">
                  <h4>{officer.name}</h4>
                </div>
                <div className="officer-title">{officer.role.fi}</div>
              </section>
            ))}
          </div>
        </section>
      )}
      {board.teams.length > 0 &&
        [...board.teams.sort((a, b) => a.id - b.id)].map(team => (
          <section className="team" key={team.id}>
            <h2>{team.title.fi}</h2>
            <ul>
              {[
                ...team.team_members
                  .filter(member => member.name !== null)
                  .sort((a, b) => a.name.localeCompare(b.name)),
              ].map(member => (
                <li key={team + "_member_" + member.name}>{member.name}</li>
              ))}
            </ul>
          </section>
        ))}
      {boardYears.length > 0 && (
        <section className="former-boards">
          <h2>Aiemmat ja muut hallitukset</h2>
          <ul>
            {boardYears.map(boardYear => (
              <li key={"boardyear_" + boardYear}>
                <Link to={"/board/" + boardYear} activeClassName="active-board">
                  {boardYear}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  )
}

export default BoardTemplateFi

export const query = graphql`
  query BoardTemplateFi($id: String) {
    strapiBoard(id: { eq: $id }) {
      id
      year
      members {
        id
        name
        email
        role {
          id
          fi
        }
      }
      officers {
        id
        name
        role {
          id
          fi
        }
      }
      teams {
        id
        title {
          id
          fi
        }
        team_members {
          id
          name
        }
      }
    }
  }
`
