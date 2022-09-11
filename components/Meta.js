import Head from "next/head"
import { SERVER } from "../config"
const Meta = ({ title = "Haruhi", url = "https://haruhi.flamindemigod.com", image = `${SERVER}/haruhi.webp`, description = "A anime streaming platform made for you by Flamindemigod" }) => {
    return (
        <Head>
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
            <title>{title}</title>
            <meta name="description" content={description} />

            <link rel="icon" href="/favicon.ico" />

            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:description" content={description} />
            <meta name="theme-color" content="#42a5f5" />
            <meta name="twitter:card" content={image} />
        </Head>
    )
}

export default Meta