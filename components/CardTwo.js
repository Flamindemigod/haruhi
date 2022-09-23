import { Box } from '@mui/material'
import Image from 'next/future/image'
import React from 'react'
import Link from './Link'
import { animated, useSpring } from '@react-spring/web';

const CardTwo = ({ width, height, mainImage, subImage = null, title, subTitle, link, status, mediaListEntryStatus }) => {
    const styles = useSpring({
        from: {
            opacity: 0,
            translateY: "50%",
            scale: 0
        },
        to: {
            scale: 1,
            opacity: 1,
            translateY: "0%"
        },
    })
    return (
        <animated.div style={styles} >
            <Box className='card' sx={{ width }}>
                <Link href={link}>
                    <Box>
                        <Image className='object-cover' width={width} height={height} src={mainImage} alt={title} />
                        {subImage ? <Image className="absolute bottom-0 right-0" width={width / 4} height={height / 4} src={subImage} alt={subTitle} /> : <></>}
                    </Box>
                    <div className='font-semibold'>{title}</div>
                </Link>
            </Box>
        </animated.div>
    )
}

export default CardTwo