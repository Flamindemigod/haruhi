import { Favorite, GitHub } from '@mui/icons-material';
import Image from 'next/image';
const Footer = () => {
    return (
        <div className='w-full bg-offWhite-700 text-offWhite-100 flex p-8 flex-col sm:flex-row justify-between'>
            <div >
                <div>Eat Cheesecake at the Néapolitan Café</div>
                <div>Be a friendly triangle like Deltoid</div>
            </div>
            <div>
                <div>Made for you with <Favorite sx={{ color: '#ff1000' }} /> by Flamindemigod </div>
                <a href={"https://ko-fi.com/flamindemigod"}><Image width={160} height={25} src='https://storage.ko-fi.com/cdn/brandasset/kofi_button_blue.png' alt='' /></a>
                <br />
                <a className='text-offWhite-100 no-underline' href={"https://github.com/andradesavio9073/haruhi"}>Submit Bug Reports or Help contribute on Github <GitHub /> </a>
            </div>
        </div>
    )
}

export default Footer