import { useSelector, useDispatch } from "react-redux";
import Meta from '../components/Meta';
import Login from "../components/Auth/Login";
import * as cookie from 'cookie'
import { setUser } from "../features/user";
import { useEffect } from "react";
import makeQuery from "../makeQuery"
export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserDetails = async () => {
      var query = `query {
                    Viewer {
                        id
                        name
                        avatar{
                            medium
                        }}
                    }`;

      const userData = await makeQuery(query, token = token).then((data) =>
        (data.data.Viewer));
      dispatch(setUser({
        userAuth: true,
        userName: userData.name,
        userID: userData.id,
        userAvatar: userData.avatar.medium,
        userToken: token,
        userPreferenceShowEndDialog: JSON.parse(localStorage.getItem("UserPrefShowEndDialog")) ? JSON.parse(localStorage.getItem("UserPrefShowEndDialog")) : true,
        userPreferenceSkipOpening: localStorage.getItem("UserPrefSkipOpening") ? parseInt(localStorage.getItem("UserPrefSkipOpening")) : 85,
        userPreferenceDubbed: JSON.parse(localStorage.getItem("UserPrefDubbed")) ? JSON.parse(localStorage.getItem("UserPrefDubbed")) : false,
        userPreferenceEpisodeUpdateTreshold: localStorage.getItem("UserPrefEpisodeTreshold") ? parseFloat(localStorage.getItem("UserPrefEpisodeTreshold")) : 0.9,
      }));
    };
    if (token) getUserDetails();
  }, [token])
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