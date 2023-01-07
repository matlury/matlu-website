import {
    chainMatch,
    csp,
    isPageRequest,
    reporting,
    strictDynamic,
} from '@next-safe/middleware'

const securityMiddleware = [
    csp({
        directives: {
            'default-src': ['self'],
            'script-src': ['self', 'https://recaptcha.net'],
            'child-src': ['https://recaptcha.net'],
            'style-src': ['self'],
            'font-src': ['self'],
            'img-src': [
                'self',
                'https://matlucms-matlucmsdatac14c1b79-1i89rnuzvbtyt.s3.eu-central-1.amazonaws.com',
            ],
            'form-action': ['self'],
        },
    }),
    strictDynamic(),
    reporting(),
]

export default chainMatch(isPageRequest)(...securityMiddleware)
