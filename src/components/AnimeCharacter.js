import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AnimeCharacter = ({ characterEdge }) => {
    return (
        <Card sx={{ minWidth: "25rem", maxWidth:"30rem", backgroundColor: "rgb(37 37 37)" }}>
            <Box className='bg-offWhite-600 text-center text-white flex flex-row justify-between'>
                <Link to={`/character/${characterEdge.node.id}`}>
                    <div className="flex">
                        <CardMedia sx={{ width: "5rem", height: "8rem", objectFit: "cover" }} component="img" src={characterEdge.node.image.large} alt={`Character Image for ${characterEdge.node.name}`} />
                        <CardContent className='flex flex-col justify-between p-4' sx={{ padding: "1rem!important" }}>
                            <div className='text-md'>{characterEdge.node.name.userPreferred}</div>
                            <div className='text-sm'>{characterEdge.role}</div>
                        </CardContent>
                    </div>
                </Link>
                {characterEdge.voiceActors.length ? (
                    <Link to={`/staff/${characterEdge.voiceActors[0].id}`}>
                    <div className="flex">
                        <CardContent className='flex flex-col justify-between  p-4'>
                            <div className='text-md'>{characterEdge.voiceActors[0].name.userPreferred}</div>
                            <div className='text-sm'>JAPANESE</div>

                        </CardContent>
                        <CardMedia sx={{ width: "5rem", height: "8rem", objectFit: "cover" }} component="img" src={characterEdge.voiceActors[0].image.large} alt={`Character Image for ${characterEdge.voiceActors[0].name}`} />
                    </div>
                    </Link>
                ) : <div className='w-full h-full bg-offWhite-600 text-white'></div>}

            </Box>
            {/* <div className='flex h-40 justify-between w-96'>
            <div className="flex">
                <LazyLoadImage src={characterEdge.node.image.large} />
                <div>{characterEdge.node.name.userPreferred}</div>
            </div>
            {characterEdge.voiceActors.length ? ( <div className='flex'>
                <div>{characterEdge.voiceActors[0].name.userPreferred}</div>
                <LazyLoadImage src={characterEdge.voiceActors[0].image.large} />
            </div>) : (<></>)}

        </div> */}
        </Card>
    )
}

AnimeCharacter.defaultProps = {
    characterEdge: {
        node: {
            id: 0,
            name: {
                userPreferred: ""
            },
            image: {
                large: ""
            }
        },
        role: "",
        voiceActors: []
    }

}
export default AnimeCharacter