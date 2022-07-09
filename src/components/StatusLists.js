import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Button } from '@mui/material';
import { Link } from "react-router-dom"
import makeQuery from '../misc/makeQuery';
import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { styled } from '@mui/material';
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "10px dot red",
  color:
    theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiButtonBase-root:not(.Mui-selected)':{
    color: "#cccd",
    borderColor:"#cccd"
  },

  '& .Mui-selected':{
    color: "var(--clr-primary)",
    borderColor:"var(--clr-primary)"
  },

  "& .MuiSvgIcon-root": {
    color: "white"
  },

  '& .MuiDataGrid-cell': {
    color: 'rgba(255,255,255,0.9)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
}));

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const ListWatching = ({status}) => {
  let user = useSelector((state) => state.user.value);
  const [animeList, setAnimeList] = useState([])
  let [rows, setRows] = useState([]);
  let [columns, setColumns] = useState([]);
  useEffect(() => {
    const getAnime = async () => {
      var query = `
            query usersAiringSchedule($perPage: Int = 50, $page: Int = 1, $userName: String, $status:MediaListStatus = CURRENT) {
                Page(perPage: $perPage, page: $page) {
                  pageInfo {
                    hasNextPage
                    total
                  }
                  mediaList(userName: $userName, type: ANIME, status: $status, sort: [UPDATED_TIME_DESC]) {
                    media {
                      episodes
                      id
                      status
                      siteUrl
                      averageScore
                      coverImage {
                        large
                      }
                      title {
                        userPreferred
                      }
                      mediaListEntry{
                        id
                        score
                        progress
                      }
                    }
                  }
                }
              }
              
        `;
      var variables = {
        perPage: 50,
        page: 0,
        userName: user.userName,
        status: status,
      };

      const getList = (data) => {
        const mediaArray = data.data.Page.mediaList;
        var airingArray = [];
        for (const media in mediaArray) {
          airingArray[media] = mediaArray[media].media;
        }


        return [data.data.Page.pageInfo.hasNextPage, airingArray];
      };
      let hasNextPage = true
      let airingArrayAccumalated = []
      let data;
      while (hasNextPage) {
        variables["page"] = variables["page"] + 1
        data = await makeQuery(query, variables).then(getList);
        hasNextPage = data[0];
        airingArrayAccumalated = airingArrayAccumalated.concat(data[1])
      }
      setAnimeList(airingArrayAccumalated)
    }
    getAnime();
  }, [])

  useEffect(() => {
    const _columns = [
      {
        field: 'image',
        sortable: false,
        headerName: '',
        width: 150,
        renderCell: (params) => <img className='object-cover w-full h-full' src={params.row.imgSrc} alt="" />, // renderCell will render the component
      },
      { field: 'name', headerName: 'Anime Title', flex: 1, minWidth: 300 },
      { field: 'status', headerName: 'Status' },
      { field: 'score', headerName: 'Score' },
      { field: 'avgScore', headerName: 'Average Score', width:150 },
      {
        field: 'progress',
        headerName: 'Progress',
      },
      {
        field: 'link',
        headerName: '',
        sortable: false,
        renderCell: (params) => (
          <Link to={`/anime/${params.row.id}`}>
            <IconButton aria-label="open">
            <LaunchIcon />
          </IconButton></Link>
        ),
      },
    ]
    setColumns(_columns);
    const createData = (id, name, status, score, avgScore, progress, imgSrc) => {
      return {
        imgSrc,
        id,
        name,
        status,
        score,
        avgScore,
        progress

      }
    }
    const _rows = animeList.map((anime) => (createData(anime.id, anime.title.userPreferred, anime.status, anime.mediaListEntry.score, anime.averageScore+"%", anime.mediaListEntry.progress, anime.coverImage.large)))
    setRows(_rows);
  }, [animeList])

  return (
    <Box sx={{width:"100%", marginInline:"auto"}}>
      <StyledDataGrid
      rowHeight={100}
      pageSize={25}
      className='styled-scrollbars'
        autoHeight
        sx={{ color: "white" }}
        rows={rows}
        columns={columns}
        components={{
          Pagination: CustomPagination,
        }}
      /></Box>
  )
}

export default ListWatching