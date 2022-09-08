import { useSelector, useDispatch } from "react-redux";

export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();


  return (
    <>
    </>
  )
}


export async function getServerSideProps(ctx) {
  const parsedCookies = cookie.parse(ctx.req.headers.cookie || "");
  return {
    props: { token: parsedCookies.access_token || null }
  }
}