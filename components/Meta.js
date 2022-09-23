import Head from "next/head"
import { SERVER } from "../config"
const Meta = ({ title = "Haruhi", url = "https://haruhi.flamindemigod.com", image = `${SERVER}/haruhi.webp`, description = "A anime streaming platform made for you by Flamindemigod" }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:description" content={description} />
            <meta name="twitter:card" content="summary" />
        </Head>
    )
}

export default Meta