import {
    getCspInitialProps,
    provideComponents,
} from '@next-safe/middleware/dist/document'
import Document, { Html, Main } from 'next/document'

export default class MyDocument extends Document {
    static async getInitialProps(ctx: any) {
        const initialProps = await getCspInitialProps({ ctx })
        return initialProps
    }

    render() {
        const { Head, NextScript } = provideComponents(this.props)
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
