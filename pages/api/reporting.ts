import { Reporter, reporting } from '@next-safe/middleware/dist/api'

/** @type {import('@next-safe/middleware/dist/api').Reporter} */
const consoleLogReporter: Reporter = (data) =>
    console.warn('CSP violation:', JSON.stringify(data))

export default reporting(consoleLogReporter)
