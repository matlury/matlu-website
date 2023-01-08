import { LocaleName } from 'common/locale'
import { NonNullableFields } from 'common/util'
import { BoardType } from '.'

interface OfficersProps {
    locale: LocaleName
    officers: NonNullableFields<NonNullable<BoardType['officers']>>
}

const Officers = ({ officers, locale }: OfficersProps) => (
    <>
        {
            // don't sort members - they come from the API in the order they're
            // ordered in in the CMS
            [...officers].map((officer) => (
                <section className="officer" key={officer.id}>
                    <div className="officer-picture"></div>
                    <div className="officer-name">
                        <h4>{officer.name}</h4>
                    </div>
                    <p className="officer-title">{officer.role?.[locale]}</p>
                </section>
            ))
        }
    </>
)

export default Officers
