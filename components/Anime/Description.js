import React, { useRef, useState } from 'react'
import { useEffect } from 'react';

const Description = ({ text }) => {
    const [open, setOpen] = useState(false);
    const [readMore, setReadMore] = useState(false);
    const descriptionContainer = useRef();

    const toggleOpen = () => {
        setOpen(state => !state)
    }

    useEffect(() => {
        setReadMore(false)
        setOpen(false)
        if (descriptionContainer.current.offsetHeight >= 170) {
            setReadMore(true);
        }
    }, [text]);

    return (
        <div className={`description--container ${readMore && "readMore"} | p-8 mb-4 relative`} ref={descriptionContainer} open={open} onClick={toggleOpen}>
            <div className='description | text-md' dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    )
}

export default Description