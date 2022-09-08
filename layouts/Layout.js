import Header from '../components/Header'
import Footer from '../components/Footer'
import Meta from '../components/Meta'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import Loading from '../components/Loading'

const Layout = ({ children }) => {
    const user = useSelector(state => state.user.value)
    return (
        <Box className='flex flex-col' sx={{ minHeight: "100vh", flex: "1 0 100%" }}>
            <Meta />
            <Loading />
            <Header />
            <div className='flex justify-center align-center w-full'>{children}</div>
            <Footer />
        </Box>
    )
}




export default Layout