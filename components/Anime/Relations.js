import { Card } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Carosel from '../Carosel'

const Relations = ({ relations }) => {
    const [_relations, setRelations] = useState([]);
    useEffect(() => {
        setRelations(relations.filter((relation) => {
            if (relation.node.type === "ANIME") {
                return true;
            }
            return false;
        })
        )
        // testr
    }, [relations])
    return (
        <>
            {_relations.length ? (<>
                <div className='text-xl'>Relations</div>
                <Carosel width="95vw">
                    {_relations.map(relation => (
                        <Link key={relation.node.id} href={`/anime/${relation.node.id}`}>
                            <Card className="cursor-pointer flex-shrink-0" sx={{ width: "19rem" }}>
                                <div className="flex h-full w-full">
                                    <div className="flex-shrink-0">
                                        <Image width={80} height={128} src={relation.node.coverImage.large} />
                                    </div>
                                    <div className='flex flex-col p-2 justify-around'>
                                        <div>{relation.node.title.userPreferred}</div>
                                        <div className='text-sm flex justify-around'>
                                            <div>{relation.node.type}</div>
                                            -
                                            <div>{relation.relationType.replace(/[_]/gm, " ")}</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </Carosel></>) : <></>}
        </>
    )
}

export default Relations