import React, { useEffect, useState } from 'react'
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import makeQuery from "../misc/makeQuery";
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import InputLabel from "@mui/material/InputLabel";
import { Button } from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from '@mui/material/Typography';
import Rating from "@mui/material/Rating";
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { styled } from '@mui/material/styles';


const DarkDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-container .MuiPaper-root': {
        color: "white",
        backgroundColor: "#2e2e2e",
        transition: theme.transitions.create([
            'box-shadow',
        ]),
        '& .MuiFormControl-root': {
            '& .MuiInputLabel-root': {
                color: "#eee"
            },
            "& .MuiInputBase-root": {
                backgroundColor: "#3e3e3e",
                color: "white"
            },
            "& .MuiSvgIcon-root": {
                color: "#777"
            },
            "& .MuiRating-iconFilled > .MuiSvgIcon-root": {
                color: "gold",
            },
            "& .MuiFormHelperText-root": {
                color: "#eee"
            }
        }
    }

}));


const AnimeListEditor = ({ mediaListEntry, mediaID, mediaTitle, setRefresh }) => {
    const [open, setOpen] = useState(false);
    const [mediaStatus, setMediaStatus] = useState("");
    const [mediaScore, setMediaScore] = useState(0);
    const [mediaProgress, setMediaProgress] = useState(0);
    const [mediaStartDate, setMediaStartDate] = useState(null);
    const [mediaEndDate, setMediaEndDate] = useState(null);
    const [mediaRewatches, setMediaRewatches] = useState(0);

    useEffect(() => {
        console.log(mediaEndDate)
    }, [mediaEndDate])


    useEffect(() => {
        if (mediaListEntry) {
            setMediaStatus(mediaListEntry.status)
            setMediaScore(mediaListEntry.score)
            setMediaProgress(mediaListEntry.progress)
            if (mediaListEntry.startedAt) {
                if (mediaListEntry.startedAt.year) {
                    setMediaStartDate(new Date().setFullYear(mediaListEntry.startedAt.year, mediaListEntry.startedAt.month - 1, mediaListEntry.startedAt.day))
                }
                else {
                    setMediaStartDate(null)
                }
            }
            if (mediaListEntry.completedAt) {
                if (mediaListEntry.completedAt.year) {
                    setMediaEndDate(new Date().setFullYear(mediaListEntry.completedAt.year, mediaListEntry.completedAt.month, mediaListEntry.completedAt.day))
                }
                else {
                    setMediaEndDate(null)
                }
            }
            setMediaRewatches(mediaListEntry.repeat)
        }
        else {
            setMediaStatus("")
            setMediaScore(0)
            setMediaProgress(0)
            setMediaStartDate(null)
            setMediaEndDate(null)
            setMediaRewatches(0)
        }
    }, [mediaListEntry])
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



        makeQuery(query, variables);
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
        makeQuery(query, variables);
    }

    return (
        <>
            <Fab sx={{ zIndex: 10 }} variant="extended" color='primary' onClick={() => { setOpen(true) }}>
                {mediaListEntry ? (<>
                    <EditIcon sx={{ mr: 1 }} />
                    {mediaListEntry.status}
                </>) :
                    (<>
                        <AddIcon sx={{ mr: 1 }} />
                        Add to List
                    </>)}
            </Fab>
            <DarkDialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                disableScrollLock={true}
                onClose={() => { setOpen(false) }}
            >
                <DialogTitle sx={{ position: "relative" }}>
                    {mediaTitle}
                    <IconButton
                        aria-label="close"
                        onClick={() => { setOpen(false) }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className='grid sm:grid-cols-2 gap-4 justify-center items-cente'>
                    <FormControl sx={{ mt: 1, justifySelf: "center", placeSelf: "center", width: "100%" }}>
                        <InputLabel id="mediaStatuslabel">Status</InputLabel>
                        <Select
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
                    <FormControl sx={{ mt: 1, width: "min-content", justifySelf: "center" }}>
                        <Typography component="legend">Score</Typography>
                        <Rating
                            sx={{ width: "min-content" }}
                            name="mediaRating"
                            value={mediaScore / 2}
                            precision={0.5}
                            defaultValue={0}
                            onChange={(event, newValue) => {
                                setMediaScore(newValue * 2);
                            }}
                        />
                    </FormControl>
                    <TextField
                        label="Episode Progress"
                        id="mediaProgress"
                        sx={{ m: 1 }}
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value))
                        }}
                        value={mediaProgress}
                        onChange={(e) => { setMediaProgress(e.target.value) }}
                    />
                    <TextField

                        label="Number of Rewatches"
                        id="mediaRewatches"
                        sx={{ m: 1 }}
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value))
                        }}
                        value={mediaRewatches}
                        onChange={(e) => { setMediaRewatches(e.target.value) }}
                    />
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
                    <DatePicker
                        disableFuture
                        id="mediaEndDate"
                        label="End date"
                        inputFormat="dd/MM/yyyy"
                        value={mediaEndDate}
                        onChange={(date) => { setMediaEndDate(date) }}
                        renderInput={(params) => (
                            <TextField {...params} helperText={params?.inputProps?.placeholder} />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(false);
                        saveMediaEntry(mediaID);
                        setRefresh((prevState) => (prevState + 1));

                    }} autoFocus variant="contained">
                        Save
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            deleteMediaEntry(mediaListEntry.id);
                            setRefresh((prevState) => (prevState + 1));

                        }}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </DarkDialog>

        </>
    )
}

AnimeListEditor.defaultProps = {
    mediaListEntry: null,
    mediaID: 0
}

export default AnimeListEditor