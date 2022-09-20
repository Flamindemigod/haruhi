import { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Search } from '@mui/icons-material';
import { Box, Button, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Link from '../Link';
import SearchMedia from './SearchMedia';
import SearchCharacter from './SearchCharacter';
import SearchStudio from './SearchStudio';
import SearchStaff from './SearchStaff';


const SearchInput = styled(InputBase)(({ theme }) => ({
    '&': { width: "100%", height: "100%" },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        transition: theme.transitions.create([
            'box-shadow',
        ]),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

const SearchButton = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <Button sx={{ color: "white", fontSize: "1.25rem", textTransform: "none", fontWeight: "normal", borderColor: "transparent", ":hover": { borderColor: "#fff" } }} variant='outlined' endIcon={<Search />} onClick={() => { setDialogOpen(true) }}> Search </Button>
            <Dialog
                sx={{ "& .MuiPaper-root": { background: "transparent", boxShadow: "none" } }}
                className='styled-scrollbars'
                maxWidth={"3xl"}
                fullWidth={true}
                open={dialogOpen}
                onClose={() => {
                    setSearchQuery("");
                    setDialogOpen(false);
                }}
                aria-labelledby="search-dialog"
                aria-describedby="search-dialog-description"
                scroll={"body"}
            >
                <DialogTitle
                    id="search-dialog-title"
                    className={"bg-offWhite-400"}>
                    <div className='flex justify-center items-center gap-2'>
                        <SearchInput placeholder="Search..." variant='standard' onChange={(e) => { setSearchQuery(e.target.value) }} ></SearchInput>
                        <Search sx={{ mr: 1, my: 0.5 }} />
                    </div>
                </DialogTitle>
                <div className='flex gap-1 w-full justify-end'>Try the <Link href="/search" ><Box className='' onClick={() => {
                    setSearchQuery("");
                    setDialogOpen(false);
                }} sx={{ color: "var(--clr-primary)" }}> Advanced Search </Box></Link></div>
                <DialogContent className='styled-scrollbars' sx={{ backgroundColor: "transparent" }}>
                    <div className='grid sm:grid-cols-2 md:grid-cols-3 max-w-8xl gap-8 gap-y-8 mx-auto mt-8'>
                        <SearchMedia searchString={searchQuery} setSearchQuery={setSearchQuery} setDialogOpen={setDialogOpen} />
                        <SearchCharacter searchString={searchQuery} setSearchQuery={setSearchQuery} setDialogOpen={setDialogOpen} />
                        <SearchStaff searchString={searchQuery} setSearchQuery={setSearchQuery} setDialogOpen={setDialogOpen} />
                        <SearchStudio searchString={searchQuery} setSearchQuery={setSearchQuery} setDialogOpen={setDialogOpen} />
                    </div>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default SearchButton