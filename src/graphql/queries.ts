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