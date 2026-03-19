export const STRAPI_PUBLIC_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:1337"
).replace(/\/$/, "");

export const API_ENDPOINTS = {
    SUBMIT_EVENT: `${STRAPI_PUBLIC_URL}/api/event-requests/submit`,
    LOCATION_SUGGESTIONS: `${STRAPI_PUBLIC_URL}/api/event-locations/suggestions`,
    TITLE_SUGGESTIONS: `${STRAPI_PUBLIC_URL}/api/event-requests/title-suggestions`,
    FEEDBACK_FORM_HANDLER:
        process.env.NEXT_PUBLIC_FEEDBACK_FORM_HANDLER_URL || "",
};

export const RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_EVENT_REQUEST_RECAPTCHA_SITE_KEY ||
    process.env.NEXT_PUBLIC_GATSBY_RECAPTCHA_SITE_KEY ||
    "";
