import { LocaleName } from 'common/locale'
import {
    ascendingByString,
    NonNullableFields,
    notNullOrUndefined,
} from 'common/util'
import { BoardType } from '.'

interface TeamsProps {
    locale: LocaleName
    teams: NonNullableFields<NonNullable<BoardType['teams']>>
}

const Teams = ({ teams, locale }: TeamsProps) => (
    <>
        {
            // don't sort members - they come from the API in the order they're
            // ordered in in the CMS
            teams.map(({ id, title, team_members }) => {
                const members = (
                    team_members?.filter(notNullOrUndefined) || []
                ).sort(ascendingByString((m) => m.name))

                return (
                    <section className="team" key={id}>
                        <h2>{title?.[locale]}</h2>
                        <ul>
                            {members.map((member) => (
                                <li key={member.id}>{member.name}</li>
                            ))}
                        </ul>
                    </section>
                )
            })
        }
    </>
)

export default Teams
