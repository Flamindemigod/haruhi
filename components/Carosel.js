import { useEffect, useState } from "react"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"
import { IconButton, Box } from "@mui/material"
import { useRef } from "react"

const Carosel = ({ width = "100vw", children }) => {
    const caroselTrack = useRef();
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)

    const scrollBack = () => {
        caroselTrack.current.scrollLeft -= (window.innerWidth / 2);

    }
    const scrollForward = () => {
        caroselTrack.current.scrollLeft += (window.innerWidth / 2);

    }


    useEffect(() => {
        if (caroselTrack.current.scrollWidth == caroselTrack.current.clientWidth) {
            setShowLeftButton(false)
            setShowRightButton(false)
        } else {
            setShowLeftButton(false)
            setShowRightButton(true)
        }
    }, [children])



    useEffect(() => {

        caroselTrack.current.addEventListener("scroll", () => {
            if (caroselTrack.current.scrollLeft === 0) {
                setShowLeftButton(false)
            }
            if (parseInt(caroselTrack.current.scrollLeft + 1) === (caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth)) {
                setShowRightButton(false)
            }
        })

        return (caroselTrack.current.removeEventListener("scroll", () => {
            setShowLeftButton(true)
            setShowRightButton(true)
            if (caroselTrack.current.scrollLeft === 0) {
                setShowLeftButton(false)
            }
            if (parseInt(caroselTrack.current.scrollLeft + 1) === (caroselTrack.current.scrollWidth - caroselTrack.current.clientWidth)) {
                setShowRightButton(false)
            }
        }))
    }, [])
    return (
        <div className="relative isolate">
            {showLeftButton && (<IconButton onClick={scrollBack} className="absolute top-1/2 left-4 z-20" sx={{ backgroundColor: "var(--clr-primary)", opacity: "0.6", "&:hover": { backgroundColor: "var(--clr-primary)", opacity: 1 }, transform: "translateY(-50%)", position: "absolute" }}>
                <ArrowBackIos />
            </IconButton>)}
            <Box width={width} className=" scroll-smooth relative flex overflow-x-auto overflow-y-hidden gap-4" ref={caroselTrack}>
                {children}
            </Box>
            {showRightButton && (<IconButton onClick={scrollForward} className="absolute top-1/2 right-4 z-20" sx={{ backgroundColor: "var(--clr-primary)", opacity: "0.6", "&:hover": { backgroundColor: "var(--clr-primary)", opacity: 1 }, transform: "translateY(-50%)", position: "absolute" }}>
                <ArrowForwardIos />
            </IconButton>)}
        </div>
    )
}

export default Carosel