import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@mui/material'
import Loading from '../components/Loading'
import { setUser } from '../features/user'
import makeQuery from "../makeQuery"
import getToken from '../getToken'
import { useEffect } from 'react'
import { setLoading } from '../features/loading'
const Layout = ({ children }) => {
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
            dispatch(setLoading(false))
        };
        const token = getToken();
        if (token) {
            getUserDetails();
        }
        else {
            dispatch(setLoading(false))

        }
    }, [])
    return (
        <Box className='flex flex-col' sx={{ minHeight: "100vh", flex: "1 0 100%" }}>
            <Loading />
            <header>
                <Header />
            </header>
            <main className='flex justify-center align-center w-full'>{children}</main>
            <footer>
                <Footer />
            </footer>
        </Box>
    )
}




export default Layout