import { Favorite, GitHub } from '@mui/icons-material';
import { Button } from '@mui/material';
import Image from "next/future/image";

const Footer = () => {
    return (
        <div className='w-full bg-offWhite-700 text-offWhite-100 flex p-8 flex-col sm:flex-row justify-between'>
            <div >
                <div>Eat Cheesecake at the Néapolitan Café</div>
                <div>Be a friendly triangle like Deltoid</div>
                <Button href={"https://ko-fi.com/flamindemigod"} variant="contained"><Image width={32} height={32} src='https://storage.ko-fi.com/cdn/brandasset/kofi_p_logo_nolabel.png' alt='Ko-fi Logo' /> Support me on Kofi</Button>
            </div>
            <div>
                <div>Made for you with <Favorite sx={{ color: '#ff1000' }} /> by Flamindemigod </div>
                <div className=""><a className='text-offWhite-100 hover:underline focus:underline' href={"https://github.com/andradesavio9073/haruhi"}>Submit Bug Reports or Help contribute on Github <GitHub /></a></div>
            </div>
        </div >
    )
}

export default Footer