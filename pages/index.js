import { useSelector, useDispatch } from "react-redux";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import Meta from '../components/Meta'

export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();


  return (
    <>
      <Meta />
      <section>
        <Recommended />
        <Trending />
      </section>
    </>
  )
}

