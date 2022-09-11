import Meta from "../components/Meta"
import { SERVER } from "../config"
const seasonal = () => {
    return (
        <div>
            <Meta
                title="Haruhi - Seasonal List"
                description="List of Seasonal Anime"
                url={`${SERVER}/seasonal`} />
        </div>
    )
}

export default seasonal