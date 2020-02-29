import React from "react"
import styles from "./ContactForm.module.scss"
import { Language } from "../utils"
import Recaptcha from "react-recaptcha"
interface ContactFormProps {
  lang: Language
}

const ContactFormFi = () => (
  <section>
    <h1>Yhteydenottolomake</h1>
    <p>
      Yhteydenottolomake on anonyymi, ja välitetään Matlun hallitukselle
      sähköpostitse. Voit halutessasi jättää viestiin yhteystietosi, jos haluat
      vastauksen yhteydenottoosi.
    </p>
    <form action="contact.php" method="POST" className={styles.contactForm}>
      <div className={styles.contactFormGroup}>
        <label htmlFor="contactmsg">Viesti</label>
        <textarea
          id="contactmsg"
          name="message"
          cols={80}
          rows={20}
          placeholder="Kirjoita viestisi..."
        />
      </div>
      <div className={styles.contactFormGroup}>
        <Recaptcha sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" />
      </div>
      <div className={styles.contactFormGroup}>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  </section>
)

const ContactFormEn = () => (
  <section>
    <h1>Contact form</h1>
    <p>
      The contact form is anonymous, and will be sent to the board of Matlu via
      email. Optionally, you can choose to leave your contact information, if
      you want an answer to your contact request.
    </p>
    <form action="contact.php" method="POST" className={styles.contactForm}>
      <div className={styles.contactFormGroup}>
        <label htmlFor="contactmsg">Message</label>
        <textarea
          id="contactmsg"
          cols={80}
          rows={20}
          placeholder="Write your message..."
        />
      </div>
      <div className={styles.contactFormGroup}>
        <Recaptcha sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" />
      </div>
      <div className={styles.contactFormGroup}>
        <button type="submit">Send</button>
      </div>
    </form>
  </section>
)

const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  if (lang === "fi") {
    return <ContactFormFi />
  }
  return <ContactFormEn />
}

export default ContactForm
