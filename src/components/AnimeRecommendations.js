import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Box } from '@mui/material';



const AnimeRecommendations = ({media}) => {
  return (
    <Card sx={{ width:"19rem", height:"12rem"}}>
        <Box className='flex flex-row h-full'>
            <CardContent className='bg-offWhite-600 w-40 text-white' sx={{flex: "1 0 auto", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <div className='text-md '>{media.title.userPreferred}</div>
            </CardContent>
            <CardMedia sx={{width:"9rem",maxHeight:"12rem", objectFit:"cover"}} component="img" image={media.coverImage.large} alt={`Cover for ${media.title.userPreferred}`}/>
        </Box>
    </Card>
  )
}

AnimeRecommendations.defaultProps = {
    media:{
        title:{userPreferred: ""},
        coverImage:{large: ""},
        type:"",
    }
}
export default AnimeRecommendations