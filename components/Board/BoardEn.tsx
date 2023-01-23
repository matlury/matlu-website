import cls from 'classnames'
import { notNullOrUndefined } from 'common/util'
import HeadTitle from 'components/HeadTitle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BoardProps } from '.'
import BoardMembers from './BoardMembers'
import Officers from './Officers'
import Teams from './Teams'

const BoardFi = ({ board, boardYears }: BoardProps) => {
    const router = useRouter()

    const { year } = board
    const members = board.members?.filter(notNullOrUndefined) || []
    const officers = board.officers?.filter(notNullOrUndefined) || []
    const teams = board.teams?.filter(notNullOrUndefined) || []

    return (
        <>
            <HeadTitle title={`Board of ${year}`} />
            <h1>Board of {year}</h1>
            <p>
                E-mail addresses are mostly in the form of{' '}
                <b>first.last@helsinki.fi</b>.
                <br />
                You can reach the whole board via{' '}
                <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.
            </p>
            <div className="board-members">
                {members.length > 0 && (
                    <BoardMembers locale="en" members={members} />
                )}
            </div>
            {officers.length > 0 && (
                <section>
                    <h2>Officials of {year}</h2>
                    <div className="officers">
                        <Officers locale="en" officers={officers} />
                    </div>
                </section>
            )}
            {teams.length > 0 && <Teams locale="en" teams={teams} />}
            {boardYears.length > 0 && (
                <section className="former-boards">
                    <h2>Former boards</h2>
                    <ul>
                        {boardYears.map(({ id, year }) => (
                            <li key={id}>
                                <Link
                                    href={`/board/${year}/`}
                                    className={cls({
                                        'active-board':
                                            router.asPath === `/board/${year}`,
                                    })}
                                >
                                    {year}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    )
}

export default BoardFi
