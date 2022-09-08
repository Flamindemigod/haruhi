import Meta from "../components/Meta"

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