import * as cookie from "cookie";
import { useEffect, useState } from "react";
import Description from "../../components/Anime/Description";
import Image from "next/future/image";
import {
  Skeleton,
  Box,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/loading";
import CardTwo from "../../components/CardTwo";
import makeQuery from "../../makeQuery";
import Meta from "../../components/Meta";

const Staff = ({ staff }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const hasHover = useMediaQuery("(hover:hover)");

  const [media, setMedia] = useState([]);
  const [onList, setOnList] = useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    dispatch(setLoading(false));
  }, [staff]);

  useEffect(() => {
    if (onList && user.userAuth) {
      const _media = staff.media.nodes.filter((media) => {
        if (media.node.mediaListEntry) {
          return true;
        }
        return false;
      });
      setMedia(_media);
    } else {
      setMedia(staff.media.nodes);
    }
  }, [onList]);
  return (
    <>
      <Meta
        title={staff.name.userPreferred}
        description={staff.description}
        image={staff.image.large}
        url={`/staff/${staff.id}`}
      />

      <div className="p-4">
        <div className="flex justify-center sm:px-16  sm:flex-row flex-col">
          {staff.image.large ? (
            <Image
              width={192}
              height={256}
              className="object-cover self-center sm:self-start mb-8"
              src={staff.image.large}
              alt={`staff ${staff.name.userPreferred}`}
            />
          ) : (
            <Skeleton variant="rectangular" width={192} height={256} />
          )}
          <div className="flex flex-col p-4 justify-center">
            <div className="px-8 text-3xl">{staff.name.userPreferred}</div>
            <div className="px-8 pb-8 text-lg">
              {staff.name.alternative.map((name) => `| ${name} |`)}
            </div>
            {staff.bloodType ? (
              <div className="text-md px-8">
                <strong>Blood Type:</strong> {staff.bloodType}
              </div>
            ) : (
              <></>
            )}
            {staff.gender ? (
              <div className="text-md px-8">
                <strong>Gender:</strong> {staff.gender}
              </div>
            ) : (
              <></>
            )}
            {staff.dateOfBirth.year ||
            staff.dateOfBirth.month ||
            staff.dateOfBirth.day ? (
              <div className="text-md px-8">
                <strong>Date of Birth:</strong> {staff.dateOfBirth.day}{" "}
                {months[staff.dateOfBirth.month - 1]} {staff.dateOfBirth.year}
              </div>
            ) : (
              <></>
            )}
            {staff.age ? (
              <div className="text-md px-8 ">
                <strong>Age:</strong> {staff.age}
              </div>
            ) : (
              <></>
            )}
            {staff.description ? (
              <Description text={staff.description} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <FormGroup className="p-8 ml-auto w-max">
          <FormControlLabel
            control={
              <Switch
                checked={onList}
                onClick={() => {
                  setOnList((state) => (state ? null : true));
                }}
              />
            }
            label="On My List"
          />
        </FormGroup>
        <div className="w-full flex justify-center">
          <Box
            className={`grid gap-4 w-max grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 3xl:grid-cols-11`}
          >
            {media.map((el) =>
              el.characters.map((_el) => (
                <CardTwo
                  key={el.node.id}
                  width={150}
                  height={256}
                  title={_el && _el.name.userPreferred}
                  mainImage={_el && _el.image.large}
                  subImage={el.node.coverImage.large}
                  subTitle={el.node.title.userPreferred}
                  link={`/anime/${el.node.id}`}
                  role={el.characterRole}
                />
              ))
            )}
          </Box>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params, req }) {
  const query = `query getStaffData($id: Int = 119331, $page: Int=1) {
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
           characterMedia(sort:START_DATE_DESC, perPage:25, page:$page) {
            pageInfo{
                hasNextPage
            } 
            edges {
               node{
                mediaListEntry{
                    status
                }
               id
               title{
                 userPreferred
               }
               coverImage{
                 large
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
       `;
  const variables = {
    id: params.id,
    page: 1,
  };
  let hasNextPage = true;
  let _staff = {};
  let data = {};
  let accumalatedEdges = [];

  while (hasNextPage) {
    const staffData = await makeQuery(
      query,
      variables,
      req.headers.cookie ? cookie.parse(req.headers.cookie).access_token : null
    );
    _staff = staffData.data.Staff;
    if (!staffData.data.Staff.characterMedia.pageInfo.hasNextPage) {
      hasNextPage = false;
    } else {
      variables["page"] = variables["page"] + 1;
    }
    accumalatedEdges = [
      ...accumalatedEdges,
      ...staffData.data.Staff.characterMedia.edges,
    ];
    data = { ..._staff, media: { nodes: accumalatedEdges } };
  }
  return {
    props: { staff: data },
  };
}

export default Staff;
