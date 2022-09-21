import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" />
                {/* Roboto Font for Mui */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                {/* Font Icons for Mui */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
                <meta name="theme-color" content="#42a5f5" />
                <meta property="og:site_name" content="Haruhi" />

            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}