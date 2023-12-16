import { gql } from "@apollo/client";

export const USER_AUTH = gql`
query USER_AUTH{
  Viewer {
    id
    name
    avatar {
      medium
    }
    options{
      displayAdultContent
    }
    mediaListOptions{
      scoreFormat
    }
  }
}
`;

export const GET_GENRES = gql`
query GET_GENRES{
  GenreCollection
}
`;

export const GET_TAGS = gql`
query GET_TAGS{
  MediaTagCollection{
    id
    name
    description
    category
		isAdult
  }
}
`;