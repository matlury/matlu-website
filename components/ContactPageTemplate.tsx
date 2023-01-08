import { LayoutSSRProps } from 'components/Layout'
import ContactForm from './ContactForm'
import PageTemplate, { PageTemplateProps } from './PageTemplate'

export interface ContactPageTemplateProps extends PageTemplateProps {
    reCaptchaSiteKey: string
}

const ContactPageTemplate = ({
    locale,
    reCaptchaSiteKey,
    ...props
}: ContactPageTemplateProps & LayoutSSRProps) => {
    return (
        <PageTemplate locale={locale} {...props}>
            <ContactForm locale={locale} reCaptchaSiteKey={reCaptchaSiteKey} />
        </PageTemplate>
    )
}

export default ContactPageTemplate
