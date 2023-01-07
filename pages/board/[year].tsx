import { notNullOrUndefined } from 'common/util'
import { withLayoutSSRProps } from 'common/withLayoutSSRProps'
import Board, { BoardType } from 'components/Board'
import Layout, { LayoutSSRProps } from 'components/Layout'
import type { ParsedUrlQuery } from 'querystring'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__'

interface BoardPageProps {
    boardYears: { id: string; year: number }[]
    board: BoardType
}

const BoardPage = ({
    boardYears,
    board,
    locale,
    ...layoutProps
}: BoardPageProps & LayoutSSRProps) => {
    return (
        <>
            <Layout locale={locale} {...layoutProps}>
                <Board locale={locale} board={board} boardYears={boardYears} />
            </Layout>
        </>
    )
}
export default BoardPage

const parseYearParam = (params: ParsedUrlQuery | undefined) => {
    if (Array.isArray(params?.year)) {
        return null
    }

    const year = parseInt(params?.year || '', 10)

    if (isNaN(year)) {
        return null
    }

    return year
}

export const getServerSideProps = withLayoutSSRProps<BoardPageProps>(
    async ({ params }) => {
        const year = parseYearParam(params)
        if (year === null) {
            return {
                notFound: true,
            }
        }

        const { data } = await client.query({
            query: gql(`
                query GetBoardByYear($year: Int!) {
                    boardYears: boards(publicationState: LIVE, where: { hidden_eq: false }) {
                        id
                        year
                    }
                    boards(publicationState: LIVE, where: { year_eq: $year, hidden_eq: false }) {
                        year
                        members {
                            id
                            name
                            email
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
                    }
                }
        `),
            variables: {
                year,
            },
        })

        const board = data?.boards?.[0]

        if (!board) {
            return {
                notFound: true,
            }
        }

        const boardYears =
            data.boardYears
                ?.filter(notNullOrUndefined)
                .map(({ id, year }) => ({ id, year })) || []

        return {
            props: {
                boardYears,
                board,
            },
        }
    }
)
