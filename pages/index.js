import { useSelector, useDispatch } from "react-redux";
import Meta from '../components/Meta'

export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();


  return (
    <>
      <Meta />
    </>
  )
}

