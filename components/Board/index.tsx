import { LocaleName } from 'common/locale'
import { GetBoardByYearQuery } from '__generated__/graphql'
import BoardEn from './BoardEn'
import BoardFi from './BoardFi'

// I don't feel like typing out the type of the graphql type.
// We return 404 in getServerSideProps if the boards[0] is null or if
// there were no boards returned, so the type below is just the type
// with null removed.
export type BoardType = NonNullable<
    NonNullable<GetBoardByYearQuery['boards']>[0]
>

export interface BoardProps {
    locale: LocaleName
    board: BoardType
    boardYears: { id: string; year: number }[]
}

const Board = (props: BoardProps) =>
    props.locale === 'fi' ? <BoardFi {...props} /> : <BoardEn {...props} />

export default Board
