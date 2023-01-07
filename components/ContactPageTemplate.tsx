import { LayoutSSRProps } from 'components/Layout'
import ContactForm from './ContactForm'
import PageTemplate, { PageTemplateProps } from './PageTemplate'

export interface ContactPageTemplateProps extends PageTemplateProps {
    reCaptchaSiteKey: string
    feedbackFormHandler: string
}

const ContactPageTemplate = ({
    locale,
    reCaptchaSiteKey,
    feedbackFormHandler,
    ...props
}: ContactPageTemplateProps & LayoutSSRProps) => {
    return (
        <PageTemplate locale={locale} {...props}>
            <ContactForm
                locale={locale}
                feedbackFormHandler={feedbackFormHandler}
                reCaptchaSiteKey={reCaptchaSiteKey}
            />
        </PageTemplate>
    )
}

export default ContactPageTemplate
