import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Meta from "../../components/Meta"
import { SERVER } from "../../config"
import { setLoading } from "../../features/loading"

const AnimeList = () => {
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setLoading(false))
    }, [])
    return (
        <div>
            <Meta
                title="Haruhi - Anime List"
                description={user.userAuth ? `${user.userName}'s Anime Lists` : "You need to be logged in to see this page"}
                url={`${SERVER}/anime`} />
        </div>
    )
}

export async function getServerSideProps() {
    return {
        props: {}
    }
}

export default AnimeList