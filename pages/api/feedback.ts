import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const {
    FEEDBACK_FORM_AWS_ACCESS_KEY_ID = '',
    FEEDBACK_FORM_AWS_SECRET_ACCESS_KEY = '',
    FEEDBACK_FORM_AWS_REGION = 'eu-west-1',
    FEEDBACK_FORM_RECAPTCHA_SECRET_KEY = '',
    FEEDBACK_FORM_RECAPTCHA_EXPECTED_SITE_DOMAIN = '',
} = process.env

type CaptchaValidationResult = {
    success: boolean
    challenge_ts: string
    hostname: string
    'error-codes': string[]
}

const ses = new SESClient({
    apiVersion: '2010-12-01',
    credentials: {
        accessKeyId: FEEDBACK_FORM_AWS_ACCESS_KEY_ID,
        secretAccessKey: FEEDBACK_FORM_AWS_SECRET_ACCESS_KEY,
    },
    region: FEEDBACK_FORM_AWS_REGION,
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const createResponse = makeCreateResponse(res)

    if (req.method !== 'POST') {
        return createResponse(405, 'only POST is allowed')
    }

    const message = req.body['message']
    const recaptchaResponse = req.body['g-recaptcha-response']

    if (typeof message !== 'string') {
        return createResponse(400, 'message is required')
    }
    if (typeof recaptchaResponse !== 'string') {
        return createResponse(400, 'g-recaptcha-response is required')
    }

    try {
        // Start validating captcha
        const captchaRes = await axios.post<CaptchaValidationResult>(
            'https://www.google.com/recaptcha/api/siteverify',
            {},
            {
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=utf-8',
                },
                params: {
                    secret: FEEDBACK_FORM_RECAPTCHA_SECRET_KEY,
                    response: recaptchaResponse,
                },
            }
        )

        if (!captchaRes.data.success) {
            return createResponse(
                400,
                `Captcha validation failed: ${
                    captchaRes.data['error-codes'] !== undefined &&
                    captchaRes.data['error-codes'].join(',')
                }`
            )
        }

        if (
            captchaRes.data.hostname !==
            FEEDBACK_FORM_RECAPTCHA_EXPECTED_SITE_DOMAIN
        ) {
            return createResponse(
                400,
                `Captcha challenge was not completed in the correct hostname. Hostname: ${captchaRes.data.hostname}`
            )
        }

        // if (process.env.NODE_ENV === 'production') {
        const sendMailCmd = new SendEmailCommand({
            Destination: {
                ToAddresses: ['hallitus@matlu.fi'],
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: message,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Uusi viesti yhteydenottolomakkeelta',
                },
            },
            Source: 'palautelomake@matlu.fi',
        })
        await ses.send(sendMailCmd)

        // }

        return res.redirect(302, '/thank-you')
    } catch (err) {
        console.error(err)
        debugger
        return createResponse(500, 'Internal server error')
    }
}

const makeCreateResponse =
    (res: NextApiResponse<string>) => (statusCode: number, body: string) => {
        return res
            .status(statusCode)
            .setHeader('Content-Type', 'text/html')
            .send(body)
    }
