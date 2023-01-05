import { LocaleName } from 'common/locale'
import React from 'react'
import { FooterEn } from './FooterEn'
import { FooterFi } from './FooterFi'

interface FooterProps {
    locale: LocaleName
}

const Footer: React.FC<FooterProps> = ({ locale }) => {
    return locale === 'fi' ? <FooterFi /> : <FooterEn />
}

export default Footer
