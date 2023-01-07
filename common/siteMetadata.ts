const siteMetadata = {
    title: 'Matlu ry',
    description:
        'Helsingin yliopiston Matemaattis-luonnontieteellisten opiskelijajärjestöjen yhteistyöjärjestö Matlu',
    author: 'Matlu ry',
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '',
    feedbackFormHandler: process.env.FEEDBACK_FORM_HANDLER_URL || '',
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION_KEY,
}

export default siteMetadata
