import { useEffect, useState } from 'react'
import Image from 'next/image';
import { useSelector } from 'react-redux';
import makeQuery from "../../makeQuery"
import { Avatar } from '@mui/material';
import Link from 'next/link';


//https://gist.github.com/techtheory/383ad87b1fdfb36cde15
function timeSince(date) {
  var seconds = Math.floor(((new Date().getTime() / 1000) - date)),
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

const Activity = () => {
  const [activity, setActivity] = useState([]);
  let user = useSelector((state) => state.user.value);
  useEffect(() => {
    const getActivity = async () => {
      const query = `query getMediaTrend {
                  Page(perPage: 10) {
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
      const data = await makeQuery(query, variables, user.userToken)
      setActivity(data.data.Page.activities)
    }
    getActivity();
  }, [])


  return (
    <>
      <div className='flex flex-col gap-2 p-2'>
        {activity.map((data) => (
          <div key={data.media.id} className='flex justify-start gap-4 p-4 bg-offWhite-700 isolate' style={{ "--tw-bg-opacity": "0.6" }}>
            <div className='h-40 w-32 relative'>
              <Image layout='fill' src={data.media.coverImage.medium} className={"object-cover"}></Image>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <div className='text-md'>{`${data.user.name} ${data.status} ${data.progress ? data.progress : ""} ${data.progress ? "of" : ""}`} <Link href={`/anime/${data.media.id}`}><span className="text-primary-500 hover:text-primary-300">{data.media.title.userPreferred}</span></Link></div>
              <Avatar alt={`Avatar of user ${data.user.name}`} src={data.user.avatar.medium} />
              <div className='text-sm'>{timeSince(data.createdAt)}</div>
            </div>

          </div>
        ))}
      </div>
    </>
  )
}

export default Activity