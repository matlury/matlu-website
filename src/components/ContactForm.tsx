import React, { useEffect, useState, useRef } from "react";
import * as styles from "./ContactForm.module.scss";
import { Language } from "../utils";
import { graphql, useStaticQuery } from "gatsby";
import ReCAPTCHA from "react-google-recaptcha";

interface ContactFormProps {
  lang: Language;
}

interface ContactFormFragmentProps {
  reCaptchaSiteKey: string;
  feedbackFormHandler: string;
}

const ContactFormFi: React.FC<ContactFormFragmentProps> = ({
  feedbackFormHandler,
  reCaptchaSiteKey,
}) => {
  const [verified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!reCaptchaSiteKey) {
      setVerified(true);
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, [reCaptchaSiteKey]);

  return (
    <section>
      <h1>Yhteydenottolomake</h1>
      <p>
        Yhteydenottolomake on anonyymi, ja välitetään Matlun hallitukselle
        sähköpostitse. Voit halutessasi jättää viestiin yhteystietosi, jos
        haluat vastauksen yhteydenottoosi.
      </p>
      <form
        action={feedbackFormHandler}
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
        {reCaptchaSiteKey && (
          <div className={styles.contactFormGroup}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={reCaptchaSiteKey}
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
            Lähetä
          </button>
        </div>
      </form>
    </section>
  );
};

const ContactFormEn: React.FC<ContactFormFragmentProps> = ({
  feedbackFormHandler,
  reCaptchaSiteKey,
}) => {
  const [verified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!reCaptchaSiteKey) {
      setVerified(true);
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, [reCaptchaSiteKey]);

  return (
    <section>
      <h1>Contact form</h1>
      <p>
        The contact form is anonymous, and will be sent to the board of Matlu
        via email. Optionally, you can choose to leave your contact information,
        if you want an answer to your contact request.{" "}
      </p>
      <form
        action={feedbackFormHandler}
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
        {reCaptchaSiteKey && (
          <div className={styles.contactFormGroup}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={reCaptchaSiteKey}
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
            Send
          </button>
        </div>
      </form>
    </section>
  );
};

interface ContactFormQuery {
  site: {
    siteMetadata: {
      recaptchaSiteKey: string;
      feedbackFormHandler: string;
    };
  };
}

const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const qry: ContactFormQuery = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          recaptchaSiteKey
          feedbackFormHandler
        }
      }
    }
  `);
  const siteMetadata = qry.site.siteMetadata;
  const recaptchaKey = siteMetadata.recaptchaSiteKey;

  if (lang === "fi") {
    return (
      <ContactFormFi
        reCaptchaSiteKey={recaptchaKey}
        feedbackFormHandler={siteMetadata.feedbackFormHandler}
      />
    );
  }
  return (
    <ContactFormEn
      reCaptchaSiteKey={recaptchaKey}
      feedbackFormHandler={siteMetadata.feedbackFormHandler}
    />
  );
};

export default ContactForm;
