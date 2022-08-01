import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import makeQuery from '../misc/makeQuery';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web'


//https://gist.github.com/techtheory/383ad87b1fdfb36cde15
function timeSince(date) {
  var seconds = Math.floor(((new Date().getTime()/1000) - date)),
  interval = Math.floor(seconds / 31536000);
  
  if (interval > 1) return interval + ` years ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " days ago";
  
  interval = Math.floor(seconds / 3600); 
  if (interval >= 1) return interval + " hours ago";
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
}

  const Activity = ({setIsEmpty}) => {
    const [activity, setActivity] = useState([]);
    let user = useSelector((state) => state.user.value);
    useEffect(() => {
        const getActivity = async () => {
              const query = `query getMediaTrend {
                  Page(perPage: 25) {
                    pageInfo {
                      hasNextPage
                    }
                    activities(type: ANIME_LIST, isFollowing: true, sort: ID_DESC) {
                      ... on ListActivity {
                        createdAt
                        id
                        user {
                          name
                          avatar{
                              medium
                          }
                        }
                        status
                        progress
                        media {
                          id
                          title {
                            userPreferred
                          }
                          coverImage {
                            medium
                          }
                        }
                      }
                    }
                  }
                }`
            const variables = {}
            const data = await makeQuery(query, variables)
            setActivity(data.data.Page.activities)

        }
        getActivity();
    }, [])
    useEffect(()=>{if (activity.length){
      setIsEmpty(false)
      return;
    }
    setIsEmpty(true)

  }, [activity])

  const styles = useSpring({
    from: {
      opacity: 0,
      translateX: "50%"
    },
    to: {
      opacity: 1,
      translateX: "0%"
    },
  })  

    return (
        <>
            <div className='flex flex-col gap-4 p-4'>
                {activity.map((data) => (
                    <animated.div className='flex justify-start gap-4 p-4 bg-offWhite-500' style={{"--tw-bg-opacity": "0.6"}}>
                        <LazyLoadImage src={data.media.coverImage.medium} className={"object-cover"}></LazyLoadImage>

                        <div className="flex flex-col justify-center gap-4">
                            <div className='text-md'>{`${data.user.name} ${data.status} ${data.progress ? data.progress : ""} ${data.progress ? "of" : ""}`} <Link className='text-primary-500 hover:text-primary-300' to={`/anime/${data.media.id}`}> {`${data.media.title.userPreferred}`}</Link></div>
                            <Avatar alt={`Avatar of user ${data.user.name}`} src={data.user.avatar.medium} />
                            <div className='text-sm'>{ timeSince(data.createdAt)}</div>
                        </div>

                    </animated.div>
                ))}
            </div>
        </>
    )
}

export default Activity