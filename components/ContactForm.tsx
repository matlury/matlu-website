import { LocaleName } from 'common/locale'
import { useCallback, useEffect, useState } from 'react'
import Reaptcha from 'reaptcha'
import styles from 'styles/components/ContactForm.module.scss'

interface LocalizedContactFormProps {
    reCaptchaSiteKey: string
}

const ContactFormFi = ({ reCaptchaSiteKey }: LocalizedContactFormProps) => {
    const [verified, setVerified] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const onLoad = useCallback(() => {
        setLoaded(true)
    }, [setLoaded])

    const onVerify = useCallback(() => {
        setVerified(true)
    }, [])

    useEffect(() => {
        return () => {
            setVerified(false)
        }
    }, [])

    return (
        <section>
            <h1>Yhteydenottolomake</h1>
            <p>
                Yhteydenottolomake on anonyymi, ja välitetään Matlun
                hallitukselle sähköpostitse. Voit halutessasi jättää viestiin
                yhteystietosi, jos haluat vastauksen yhteydenottoosi.
            </p>
            <form
                action="/api/feedback"
                method="POST"
                className={styles.contactForm}
            >
                <div className={styles.contactFormGroup}>
                    <label htmlFor="contactmsg">Viesti</label>
                    <textarea
                        id="contactmsg"
                        name="message"
                        cols={80}
                        rows={10}
                        placeholder="Kirjoita viestisi..."
                    />
                </div>
                <div className={styles.contactFormGroup}>
                    <Reaptcha
                        sitekey={reCaptchaSiteKey}
                        onVerify={onVerify}
                        onLoad={onLoad}
                    />
                </div>
                <div className={styles.contactFormGroup}>
                    <button type="submit" disabled={!loaded || !verified}>
                        Lähetä
                    </button>
                </div>
            </form>
        </section>
    )
}

const ContactFormEn = ({ reCaptchaSiteKey }: LocalizedContactFormProps) => {
    const [verified, setVerified] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const onLoad = useCallback(() => {
        setLoaded(true)
    }, [setLoaded])

    const onVerify = useCallback(() => {
        setVerified(true)
    }, [])

    useEffect(() => {
        return () => {
            setVerified(false)
        }
    }, [])

    return (
        <section>
            <h1>Contact form</h1>
            <p>
                The contact form is anonymous, and will be sent to the board of
                Matlu via email. Optionally, you can choose to leave your
                contact information, if you want an answer to your contact
                request.{' '}
            </p>
            <form
                action="/api/feedback"
                method="POST"
                className={styles.contactForm}
            >
                <div className={styles.contactFormGroup}>
                    <label htmlFor="contactmsg">Message</label>
                    <textarea
                        id="contactmsg"
                        name="message"
                        cols={80}
                        rows={10}
                        placeholder="Write your message..."
                    />
                </div>
                <div className={styles.contactFormGroup}>
                    <Reaptcha
                        sitekey={reCaptchaSiteKey}
                        onVerify={onVerify}
                        onLoad={onLoad}
                    />
                </div>
                <div className={styles.contactFormGroup}>
                    <button type="submit" disabled={!loaded || !verified}>
                        Send
                    </button>
                </div>
            </form>
        </section>
    )
}

export interface ContactFormProps extends LocalizedContactFormProps {
    locale: LocaleName
}

const ContactForm = ({ locale, ...props }: ContactFormProps) => {
    const Component = locale === 'fi' ? ContactFormFi : ContactFormEn
    return <Component {...props} />
}

export default ContactForm
