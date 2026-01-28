"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./ContactForm.module.scss";
import { Language } from "../utils";
import ReCAPTCHA from "react-google-recaptcha";

interface ContactFormProps {
  lang: Language;
}

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_GATSBY_RECAPTCHA_SITE_KEY || "";
const FEEDBACK_FORM_HANDLER =
  process.env.NEXT_PUBLIC_FEEDBACK_FORM_HANDLER_URL || "";

export const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const [verified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      setVerified(true);
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, []);

  const isFi = lang === "fi";

  return (
    <section>
      <h1>{isFi ? "Yhteydenottolomake" : "Contact form"}</h1>
      <p>
        {isFi ? (
          <>
            Yhteydenottolomake on anonyymi, ja välitetään Matlun hallitukselle
            sähköpostitse. Voit halutessasi jättää viestiin yhteystietosi, jos
            haluat vastauksen yhteydenottoosi.
          </>
        ) : (
          <>
            The contact form is anonymous, and will be sent to the board of
            Matlu via email. Optionally, you can choose to leave your contact
            information, if you want an answer to your contact request.
          </>
        )}
      </p>
      <form
        action={FEEDBACK_FORM_HANDLER}
        method="POST"
        className={styles.contactForm}
      >
        <div className={styles.contactFormGroup}>
          <label htmlFor="contactmsg">{isFi ? "Viesti" : "Message"}</label>
          <textarea
            id="contactmsg"
            name="message"
            cols={80}
            rows={10}
            placeholder={
              isFi ? "Kirjoita viestisi..." : "Write your message..."
            }
          />
        </div>
        {RECAPTCHA_SITE_KEY && (
          <div className={styles.contactFormGroup}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(value) => {
                if (value) {
                  setVerified(true);
                } else {
                  setVerified(false);
                }
              }}
            />
          </div>
        )}
        <div className={styles.contactFormGroup}>
          <button type="submit" disabled={!loaded || !verified}>
            {isFi ? "Lähetä" : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
