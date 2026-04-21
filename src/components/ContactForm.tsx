"use client";

import React, { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { Language } from "../utils";
import { TextareaInput } from "./ui/TextareaInput";
import { CONTACT_TEXT } from "@/locales/contact";
import { API_ENDPOINTS, RECAPTCHA_SITE_KEY } from "@/api";

interface ContactFormProps {
  lang: Language;
}

export const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const t = CONTACT_TEXT[lang];
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

  return (
    <Box as="section" maxWidth="800px" margin="1rem 0">
      <Heading as="h1" fontSize="var(--font-size-h1)" lineHeight="var(--line-height-h1)" marginBottom="0.5em" color="#0f172a">
        {t.title}
      </Heading>
      <Text fontSize="var(--font-size-body)" lineHeight="var(--line-height-body)" marginBottom="1.5rem" color="#475569" maxWidth="65ch">
        {t.description}
      </Text>

      <form
        action={API_ENDPOINTS.FEEDBACK_FORM_HANDLER}
        method="POST"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}
      >
        <TextareaInput
          id="contactmsg"
          name="message"
          label={t.messageLabel}
          placeholder={t.messagePlaceholder}
          rows={10}
          required
        />

        {RECAPTCHA_SITE_KEY && (
          <Box margin="0.25rem 0">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(value) => {
                setVerified(!!value);
              }}
            />
          </Box>
        )}

        <Button
          type="submit"
          disabled={!loaded || !verified}
          variant="primary"
          size="md"
          style={{ width: "fit-content", alignSelf: "flex-end" }}
        >
          {t.send}
        </Button>
      </form>
    </Box>
  );
};

export default ContactForm;
