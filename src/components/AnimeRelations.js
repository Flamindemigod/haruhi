import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Box } from '@mui/material';



const AnimeRelations = ({media, relationship}) => {
  return (
    <Card sx={{ width:"25rem"}}>
        <Box sx={{display: "flex", flexDirection: "row"}}>
            <CardContent className='dark:bg-offWhite-600 dark:text-white' sx={{flex: "1 0 auto", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                <div className='text-xl w-52'>{media.title.userPreferred}</div>
                <div className='text-sm flex justify-around'>
                    <div>{media.type}</div>
                    -
                    <div>{relationship}</div>
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