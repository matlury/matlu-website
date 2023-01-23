import { LocaleName } from 'common/locale'
import { FooterDocument } from './FooterDocument'
import { FooterEn } from './FooterEn'
import { FooterFi } from './FooterFi'

interface FooterProps {
    locale: LocaleName
    documents: FooterDocument[]
}

const Footer = ({ locale, documents }: FooterProps) => {
    const Component = locale === 'fi' ? FooterFi : FooterEn
    return <Component documents={documents} />
}

export default Footer
