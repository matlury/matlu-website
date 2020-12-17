import React, { useCallback, useEffect, useState } from "react";
import styles from "./ContactForm.module.scss";
import { Language } from "../utils";
import { graphql, useStaticQuery } from "gatsby";
import Reaptcha from "reaptcha";
interface ContactFormProps {
  lang: Language;
}

interface ContactFormFragmentProps {
  reCaptchaSiteKey: string;
  feedbackFormHandler: string;
}

const ContactFormFi: React.FC<ContactFormFragmentProps> = ({
  feedbackFormHandler,
}) => {
  const [verified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [response, setResponse] = useState("");
  const onLoad = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);
  useEffect(() => {
    return () => {
      setResponse("");
      setVerified(false);
    };
  }, []);
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
        <div className={styles.contactFormGroup}>
          <Reaptcha
            sitekey={String(process.env.GATSBY_RECAPTCHA_SITE_KEY)}
            onVerify={(response) => {
              setVerified(true);
              setResponse(response);
            }}
            onLoad={onLoad}
          />
        </div>
        {response !== "" && (
          <input type="hidden" name="g-recaptcha-response" value={response} />
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
}) => {
  const [verified, setVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [response, setResponse] = useState("");
  const onLoad = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);
  useEffect(() => {
    return () => {
      setResponse("");
      setVerified(false);
    };
  }, []);
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
            cols={80}
            rows={10}
            placeholder="Write your message..."
          />
        </div>
        <div className={styles.contactFormGroup}>
          <Reaptcha
            sitekey={String(process.env.GATSBY_RECAPTCHA_SITE_KEY)}
            onVerify={(response) => {
              setVerified(true);
              setResponse(response);
            }}
            onLoad={onLoad}
          />
        </div>
        {response !== "" && (
          <input type="hidden" name="g-recaptcha-response" value={response} />
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
  const qry: ContactFormQuery = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            feedbackFormHandler
          }
        }
      }
    `
  );
  if (lang === "fi") {
    return (
      <ContactFormFi
        reCaptchaSiteKey={qry.site.siteMetadata.recaptchaSiteKey}
        feedbackFormHandler={qry.site.siteMetadata.feedbackFormHandler}
      />
    );
  }
  return (
    <ContactFormEn
      reCaptchaSiteKey={qry.site.siteMetadata.recaptchaSiteKey}
      feedbackFormHandler={qry.site.siteMetadata.feedbackFormHandler}
    />
  );
};

export default ContactForm;
