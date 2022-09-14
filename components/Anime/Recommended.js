import React from 'react'
import Carosel from '../Carosel'
import Card from "../Card"
const Recommended = ({ recommendations }) => {
    return (
        <>
            <div className='text-xl'>Recommendations</div>
            <Carosel width="95vw">
                {recommendations.map((edge, index) => (<Card
                    key={edge.node.mediaRecommendation.id}
                    title={edge.node.mediaRecommendation.title.userPreferred}
                    status={edge.node.mediaRecommendation.status}
                    image={edge.node.mediaRecommendation.coverImage.large}
                    link={`/anime/${edge.node.mediaRecommendation.id}`}
                    width={128}
                    height={167}
                    changeDirection={((recommendations.length - index) < 5) ? true : false}
                />))}
            </Carosel>
        </>
    )
}

export default Recommended