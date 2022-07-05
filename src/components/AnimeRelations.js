import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Box } from '@mui/material';



const AnimeRelations = ({media, relationship}) => {
  return (
    <Card sx={{ width:"19rem", height:"12rem"}}>
        <Box className='flex flex-row h-full'>
            <CardContent className='bg-offWhite-600 w-40 text-white' sx={{flex: "1 0 auto", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <div className='text-md '>{media.title.userPreferred}</div>
                <div className='text-sm flex justify-around'>
                    <div>{media.type}</div>
                    -
                    <div>{relationship.replace("_", " ")}</div>
                </div>
            </CardContent>
            <CardMedia sx={{width:"9rem",maxHeight:"12rem", objectFit:"cover"}} component="img" image={media.coverImage.large} alt={`Cover for ${media.title.userPreferred}`}/>
        </Box>
    </Card>
  )
}

AnimeRelations.defaultProps = {
    media:{
        title:{userPreferred: ""},
        coverImage:{large: ""},
        type:"",
    }
}
export default AnimeRelations