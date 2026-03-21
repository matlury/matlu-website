"use client";

import React, { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styled from "styled-components";
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
    <Section>
      <Title>{t.title}</Title>
      <Description>{t.description}</Description>

      <Form
        action={API_ENDPOINTS.FEEDBACK_FORM_HANDLER}
        method="POST"
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
          <RecaptchaWrapper>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(value) => {
                setVerified(!!value);
              }}
            />
          </RecaptchaWrapper>
        )}

        <SubmitButton
          type="submit"
          disabled={!loaded || !verified}
        >
          {t.send}
        </SubmitButton>
      </Form>
    </Section>
  );
};
const Section = styled.section`
  max-width: 800px;
  margin: 1rem 0;
`;

const Title = styled.h1`
  font-size: var(--font-size-h1);
  line-height: var(--line-height-h1);
  margin-bottom: 0.5em;
  color: #0f172a;
`;

const Description = styled.p`
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  margin-bottom: 1.5rem;
  color: #475569;
  max-width: 65ch;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
`;

const RecaptchaWrapper = styled.div`
  margin: 0.25rem 0;
`;

const SubmitButton = styled.button`
  background-color: var(--main-color);
  color: white;
  border: 0;
  border-radius: 6px;
  font-weight: 700;
  height: 48px;
  padding: 0 2.5rem;
  font-size: var(--font-size-body);
  width: fit-content;
  align-self: flex-end;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
...
    cursor: pointer;
    filter: brightness(0.9);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(1, 73, 188, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #94a3b8;
  }
`;

export default ContactForm;
