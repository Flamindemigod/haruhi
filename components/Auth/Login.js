import { useEffect } from 'react'
import Button from '@mui/material/Button';
import { setLoading } from "../../features/loading";
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { SERVER } from '../../config';
import { width } from '@mui/system';

const Login = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setLoading(false))
    })
    return (
        <div className='w-full relative min-h-screen flex justify-center items-center'>
            <Image layout='fill' className='absolute -z-10 object-cover' src={`${SERVER}/haruhi.webp`} />
            <div className='p-8 bg-offWhite-600 bg-opacity-60 rounded-lg'>
                <h1 className='text-3xl text-center'>Meet Haruhi</h1>
                <p>An Anime streaming platform powered by React and Next.js with Anilist integration</p>
                <Button variant="contained" color="primary" href={`https://anilist.co/api/v2/oauth/authorize?client_id=8343&response_type=token`} className="w-full"><Image src={`${SERVER}/AnilistIcon.svg`} width={37} height={37} /> Login With Anilist</Button>
            </div>
        </div>
    )
}

export default Login