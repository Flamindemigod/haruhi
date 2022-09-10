import { useSelector, useDispatch } from "react-redux";
import CurrentlyWatching from "../components/Home/CurrentlyWatching";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import TrendingSeason from "../components/Home/TrendingSeason";
import Meta from '../components/Meta'

export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();


  return (
    <>
      <Meta />
      <section>
        {user.userAuth && <CurrentlyWatching />}
        {user.userAuth && <Recommended />}
        <TrendingSeason />
        <Trending />
      </section>
    </>
  )
}

