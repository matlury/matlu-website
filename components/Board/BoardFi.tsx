import cls from 'classnames'
import { formatTitle, notNullOrUndefined } from 'common/util'
import Head from 'next/head'
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
            <Head>
                <title>{formatTitle(`Vuoden ${year} hallitus`)}</title>
            </Head>
            <h1>Hallitus {year}</h1>
            <p>
                Sähköpostit pääsääntöisesti muotoa <b>etu.suku@helsinki.fi</b>.
                <br /> Koko hallitukseen saa yhteyden osoitteesta{' '}
                <a href="mailto:hallitus@matlu.fi">hallitus@matlu.fi</a>.
            </p>
            <div className="board-members">
                {members.length > 0 && (
                    <BoardMembers locale="fi" members={members} />
                )}
            </div>
            {officers.length > 0 && (
                <section>
                    <h2>Virkailijat {year}</h2>
                    <div className="officers">
                        <Officers locale="fi" officers={officers} />
                    </div>
                </section>
            )}
            {teams.length > 0 && <Teams locale="fi" teams={teams} />}
            {boardYears.length > 0 && (
                <section className="former-boards">
                    <h2>Aiemmat ja muut hallitukset</h2>
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
