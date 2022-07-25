import { useEffect, useState, createRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/loading';
import makeQuery from '../misc/makeQuery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { animated, useSpring } from '@react-spring/web'

const CharacterMediaCard = ({ characterImage, mediaImage, characterName, characterRole, mediaTitle, mediaID }) => {
    const styles = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        }
    })
    return (
        <Link to={`/anime/${mediaID}`}>
            <animated.div className='relative w-40' style={styles}>
                <div className='overflow-hidden w-40 relative'>
                    <LazyLoadImage className='h-full w-full object-cover' src={characterImage} alt={`Character ${characterImage}`} />
                    <div className='absolute bottom-0 right-0 top-2/3 left-2/3'><LazyLoadImage className='w-full h-full object-cover' src={mediaImage} alt={`Media ${mediaTitle}`} /></div>
                </div>
                <div>
                    <span className='font-semibold'>{characterName}</span> <span className='text-sm'> {characterRole}</span>
                </div>
                <div className='text-sm'>
                    {mediaTitle}
                </div>
            </animated.div>
        </Link>
    )
}


const Staff = () => {
    const params = useParams();
    const dispatch = useDispatch()
    const [onList, setOnList] = useState(null);
    let description = createRef();
    const [showDescription, setShowDescription] = useState(true);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [staff, setStaff] = useState({
        name: {
            userPreferred: "",
            alternative: []
        },
        languageV2: "",
        image: {
            large: ""
        },
        description: "",
        characterMedia: [],
        dateOfBirth: {
            year: null,
            month: null,
            day: null
        }
    })

    useEffect(() => {

        const getStaff = async () => {
            const query = `query getStaffData($id: Int = 119331, $onList: Boolean, $page: Int=1) {
                Staff(id: $id){
                 name{
                   userPreferred
                   alternative
                 }
                 languageV2
                 image{
                   large
                 }
                 description(asHtml:true)
                   dateOfBirth {
                     year
                     month
                     day
                   }
                 age
                 gender
                 yearsActive
                 homeTown
                 bloodType
                   characterMedia(sort:START_DATE_DESC, perPage:25, onList:$onList page:$page) {
                    pageInfo{
                        hasNextPage
                    } 
                    edges {
                       node{
                       id
                       title{
                         userPreferred
                       }
                       coverImage{
                         medium
                       }
                     }
                     characters {
                       name{
                         userPreferred
                       }
                               image{
                         large
                       }
                     }
                     characterRole
                     
                     }
                   }
               }
               }               
               `
            const variables = {
                id: params.id,
                page: 1,
                onList
            };
            let hasNextPage = true
            let _staff = {};
            let accumalatedEdges = [];

            while (hasNextPage) {
                const staffData = await makeQuery(query, variables)
                _staff = staffData.data.Staff
                document.title = `Haruhi - ${_staff.name.userPreferred}`
                if (!staffData.data.Staff.characterMedia.pageInfo.hasNextPage) {
                    hasNextPage = false;
                }
                else {
                    variables["page"] = variables["page"] + 1
                }
                accumalatedEdges = [...accumalatedEdges, ...staffData.data.Staff.characterMedia.edges]
                setStaff({ ..._staff, characterMedia: accumalatedEdges })
                dispatch(setLoading(false));


            }

        }
        getStaff();
    }, [onList])

    useEffect(()=>{
        if (description.current.offsetHeight >= 170) {
            setShowDescription(false)
          }
    }, [staff])
    return (
        <div className='p-8'>
            <div className="flex flex-col sm:flex-row justify-center px-16">
                <LazyLoadImage
                    className='h-64 w-48 object-cover self-center sm:self-start mb-8'
                    src={staff.image.large}
                    alt={`staff ${staff.name.userPreferred}`} />
                <div className="flex flex-col px-4 justify-center">
                    <div className='px-8 text-3xl'>{staff.name.userPreferred}</div>
                    <div className='px-8 pb-8 text-lg'>{staff.name.alternative.map((name) => (`| ${name} |`))}</div>

                    {staff.bloodType ? <div className='text-md px-8'><strong>Blood Type:</strong> {staff.bloodType}</div> : <></>}
                    {staff.gender ? <div className='text-md px-8'><strong>Gender:</strong> {staff.gender}</div> : <></>}
                    {staff.dateOfBirth.year || staff.dateOfBirth.month || staff.dateOfBirth.day ? <div className='text-md px-8'><strong>Date of Birth:</strong> {staff.dateOfBirth.day}  {months[staff.dateOfBirth.month - 1]}   {staff.dateOfBirth.year}</div> : <></>}
                    {staff.age ? <div className='text-md px-8'><strong>Age:</strong> {staff.age}</div> : <></>}
                    
                    <div className='text-md px-8 description' ref={description} data-description-shown={showDescription} dangerouslySetInnerHTML={{ __html: staff.description.replaceAll("https://anilist.co/", "http://haruhi.flamindemigod.com/") }} />
                    {!showDescription ? <button className='hover:underline text-primary-400 hover:text-primary-600' onClick={()=>{setShowDescription(true)}}> Show More</button> : <></>}
                </div>
            </div>

            <FormGroup className='p-8 ml-auto w-max'>
                <FormControlLabel control={<Switch checked={onList} onClick={() => { setOnList((state) => (state ? null : true)) }} />} label="On My List" />
            </FormGroup>
            <div className='flex flex-wrap gap-4 justify-center'>
                {staff.characterMedia.map((edge) => (edge.characters.map((character) => (<CharacterMediaCard
                    key={edge.node.id}
                    characterImage={character.image.large}
                    mediaImage={edge.node.coverImage.medium}
                    characterName={character.name.userPreferred}
                    characterRole={edge.characterRole}
                    mediaTitle={edge.node.title.userPreferred}
                    mediaID={edge.node.id}
                />))

                ))}
            </div>
        </div>
    )
}

export default Staff