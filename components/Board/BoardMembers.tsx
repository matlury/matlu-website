import { LocaleName } from 'common/locale'
import { NonNullableFields } from 'common/util'
import { BoardType } from '.'

interface BoardMembersProps {
    locale: LocaleName
    members: NonNullableFields<NonNullable<BoardType['members']>>
}

const BoardMembers = ({ members, locale }: BoardMembersProps) => (
    <>
        {
            // don't sort members - they come from the API in the order they're
            // ordered in in the CMS
            [...members].map((member) => (
                <section className="board-member" key={member.id}>
                    <div className="member-picture"></div>
                    <div className="member-name">
                        <h4>{member.name}</h4>
                    </div>
                    <p className="member-title">{member.role?.[locale]}</p>
                    {member.email !== null && (
                        <div className="member-email">
                            <a href={'mailto:' + member.email}>
                                {member.email}
                            </a>
                        </div>
                    )}
                </section>
            ))
        }
    </>
)

export default BoardMembers
