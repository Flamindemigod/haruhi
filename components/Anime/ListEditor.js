import { Add, Edit } from '@mui/icons-material'
import { Box, Dialog, Fab, FormControl, InputLabel, Select, MenuItem, TextField, DialogActions, Button } from '@mui/material'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ListRating from './ListRating'
import { DatePicker } from '@mui/x-date-pickers'
import makeQuery from '../../makeQuery'


const ListEditor = ({ anime, refresh }) => {
    const user = useSelector(state => state.user.value)
    const [open, setOpen] = useState(false);
    const [mediaStatus, setMediaStatus] = useState("");
    const [mediaScore, setMediaScore] = useState(0);
    const [mediaProgress, setMediaProgress] = useState(0);
    const [mediaStartDate, setMediaStartDate] = useState(null);
    const [mediaEndDate, setMediaEndDate] = useState(null);
    const [mediaRewatches, setMediaRewatches] = useState(0);

    useEffect(() => {
        if (anime.mediaListEntry) {
            setMediaStatus(anime.mediaListEntry.status)
            setMediaScore(anime.mediaListEntry.score)
            setMediaProgress(anime.mediaListEntry.progress)
            if (anime.mediaListEntry.startedAt) {
                console.log(anime.mediaListEntry.startedAt)
                if (anime.mediaListEntry.startedAt.year) {
                    setMediaStartDate(new Date().setFullYear(anime.mediaListEntry.startedAt.year, anime.mediaListEntry.startedAt.month - 1, anime.mediaListEntry.startedAt.day))
                }
                else {
                    setMediaStartDate(null)
                }
            }
            if (anime.mediaListEntry.completedAt) {
                if (anime.mediaListEntry.completedAt.year) {
                    setMediaEndDate(new Date().setFullYear(anime.mediaListEntry.completedAt.year, anime.mediaListEntry.completedAt.month - 1, anime.mediaListEntry.completedAt.day))
                }
                else {
                    setMediaEndDate(null)
                }
            }
            setMediaRewatches(anime.mediaListEntry.repeat)
        }
        else {
            setMediaStatus("")
            setMediaScore(0)
            setMediaProgress(0)
            setMediaStartDate(null)
            setMediaEndDate(null)
            setMediaRewatches(0)
        }
    }, [anime.mediaListEntry])

    const saveMediaEntry = async (mediaID) => {
        const query = `
        mutation saveMediaEntry($id: Int, $mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $repeat: Int, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput) {
          SaveMediaListEntry(id: $id, mediaId: $mediaId, status: $status, score: $score, progress: $progress, repeat: $repeat, startedAt: $startedAt, completedAt: $completedAt) {
            id
          }
        }
        `;

        let variables = {
            mediaId: mediaID,
            status: mediaStatus,
            progress: mediaProgress,
            repeat: mediaRewatches,
            score: mediaScore,
            startedAt: {
                year: mediaStartDate ? new Date(mediaStartDate).getFullYear() : null,
                month: mediaStartDate ? new Date(mediaStartDate).getMonth() : null,
                day: mediaStartDate ? new Date(mediaStartDate).getDate() : null,
            },
            completedAt: {
                year: mediaEndDate ? new Date(mediaEndDate).getFullYear() : null,
                month: mediaEndDate ? new Date(mediaEndDate).getMonth() : null,
                day: mediaEndDate ? new Date(mediaEndDate).getDate() : null,
            },
        };

        makeQuery(query, variables, user.userToken);
        refresh();
    }
    const deleteMediaEntry = async (mediaListEntry) => {
        const query = `
        mutation deleteMediaEntry($id: Int) {
          DeleteMediaListEntry(id: $id) {
            deleted
          }
        }      
        `;
        const variables = {
            id: mediaListEntry
        }
        makeQuery(query, variables, user.userToken);
        refresh();
    }
    return (
        <>
            <Fab sx={{ zIndex: 10 }} variant="extended" disabled={!user.userAuth} color='primary' onClick={() => { setOpen(true) }}>
                {anime.mediaListEntry ? (<>
                    <Edit sx={{ mr: 1 }} />
                    {anime.mediaListEntry.status}
                </>) :
                    (<>
                        <Add sx={{ mr: 1 }} />
                        Add to List
                    </>)}
            </Fab>
            <Dialog open={open} onClose={() => { setOpen(false) }} fullWidth maxWidth={"lg"}>
                <Box className="relative w-full">
                    <Box className="relative w-full" sx={{ aspectRatio: "21 / 6", maxHeight: "20rem" }}>
                        <Image src={anime.bannerImage || ""} layout="fill" className='object-cover' />
                        <Box className='flex absolute top-1/2 w-full px-10' sx={{
                            transform: "translateY(-50%)"
                        }}>
                            <div className="flex items-center flex-shrink-0">
                                <Image src={anime.coverImage.large} width={80} height={127} className="object-contain" />
                            </div>
                            <div className='w-full bg-black bg-opacity-40 p-4'>
                                <div className='media--title | text-xl font-semibold'>{anime.title.userPreferred}</div>
                                <div className='media--title'>{anime.title.english}</div>
                            </div>
                        </Box>
                    </Box>
                    <form className='flex flex-wrap p-8 justify-center gap-4' onSubmit={() => {
                        saveMediaEntry(anime.id);
                    }}>
                        <FormControl sx={{ width: "10rem" }}>
                            <InputLabel id="mediaStatuslabel">Status</InputLabel>
                            <Select
                                MenuProps={{
                                    disableScrollLock: true,
                                }}
                                labelId="mediaStatuslabel"
                                id="mediaStatus"
                                value={mediaStatus}
                                label="Status"
                                onChange={(e) => { setMediaStatus(e.target.value) }}
                            >
                                <MenuItem value={"CURRENT"}>Watching</MenuItem>
                                <MenuItem value={"PLANNING"}>Plan to Watch</MenuItem>
                                <MenuItem value={"COMPLETED"}>Completed</MenuItem>
                                <MenuItem value={"REPEATING"}>Rewatching</MenuItem>
                                <MenuItem value={"PAUSED"}>Paused</MenuItem>
                                <MenuItem value={"DROPPED"}>Dropped</MenuItem>
                            </Select>
                        </FormControl>
                        <ListRating score={mediaScore} setScore={setMediaScore} />
                        <FormControl sx={{ width: "10rem" }}>
                            <TextField
                                label="Episode Progress"
                                id="mediaProgress"
                                type="number"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                onInput={(e) => {
                                    e.target.value = Math.min(Math.max(0, parseInt(e.target.value)), anime.episodes)
                                }}
                                value={mediaProgress}
                                onChange={(e) => { setMediaProgress(e.target.value) }}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "10rem" }}>
                            <TextField
                                label="Number of Rewatches"
                                id="mediaRewatches"
                                type="number"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                onInput={(e) => {
                                    e.target.value = Math.max(0, parseInt(e.target.value))
                                }}
                                value={mediaRewatches}
                                onChange={(e) => { setMediaRewatches(e.target.value) }}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "10rem" }}>
                            <DatePicker
                                disableFuture
                                id="mediaStartDate"
                                label="Start date"
                                inputFormat="dd/MM/yyyy"
                                value={mediaStartDate}
                                onChange={(date) => { setMediaStartDate(date) }}
                                renderInput={(params) => (
                                    <TextField {...params} helperText={params?.inputProps?.placeholder} />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "10rem" }}>
                            <DatePicker
                                disableFuture
                                id="mediaEndDate"
                                label="End date"
                                inputFormat="dd/MM/yyyy"
                                value={mediaEndDate}
                                onChange={(date) => { setMediaEndDate(date) }}
                                renderInput={(params) => (
                                    <TextField {...params} helperText={params?.inputProps?.placeholder} />
                                )} />
                        </FormControl>
                    </form>
                </Box>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(false);
                        saveMediaEntry(anime.id);
                    }} autoFocus variant="contained">
                        Save
                    </Button>
                    {anime.mediaListEntry && <Button
                        onClick={() => {
                            setOpen(false);
                            deleteMediaEntry(anime.mediaListEntry.id);
                        }}
                        autoFocus
                        variant="contained"
                        color="secondary"
                    >
                        Delete
                    </Button>}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ListEditor