import { gsspWithNonce } from '@next-safe/middleware/dist/document'
import { notNullOrUndefined } from 'common/util'
import client from 'services/cms/apollo-client'
import { gql } from '__generated__'

// We only use this for a redirect but nextjs requires a component
// so just pass a no-op
const noop = () => <></>
export default noop

export const getServerSideProps = gsspWithNonce(async () => {
    const { data } = await client.query({
        query: gql(`
            query GetBoardYears {
                boardYears: boards(publicationState: LIVE, sort: "year:desc", where: { hidden_eq: false }) {
                    id
                    year
                }
            }
        `),
    })

    const boardYears = data.boardYears?.filter(notNullOrUndefined)

    if (!boardYears || boardYears.length === 0) {
        return {
            notFound: true,
        }
    }

    // we don't need to specifically grab the Helsinki time year because
    // the website isn't updated before the year changes anyways
    const currentYear = new Date().getUTCFullYear()
    const currentYearsBoard = boardYears.find((b) => b.year === currentYear)

    // if we have a board for the current year, redirect there
    if (currentYearsBoard) {
        return {
            redirect: {
                permanent: false,
                destination: `/board/${currentYearsBoard.year}`,
            },
        }
    }

    // if not, redirect to the latest year, graphql should sort them
    // by year descending
    return {
        redirect: {
            permanent: false,
            destination: `/board/${boardYears[0].year}`,
        },
    }
})
