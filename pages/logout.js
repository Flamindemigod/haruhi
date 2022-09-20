import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { unsetUser } from '../features/user';
import Meta from '../components/Meta';
import { useEffect } from 'react';
const Logout = () => {
    const user = useSelector(state => state.user.value);
    const dispatch = useDispatch();

    const handleLogout = () => {
        document.cookie = document.cookie + ";max-age=0";
        dispatch(unsetUser());
    }

    useEffect(() => { if (user.userAuth) { handleLogout() } Router.push("/") }, [])

    return (
        <>
            <Meta title='Haruhi - Logout'
                description={user.userAuth ? "Haruhi logout method" : "You need to be logged in to see this page"} />
            <div className="flex items-center text-3xl">
                {
                    user.userAuth ? "See ya laters" : "You need to be logged in to use this page"
                }
            </div>
        </>
    )
}

export default Logout