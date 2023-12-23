import { gql } from "graphql-tag";

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



export const SEARCH_ANIME_MANGA = gql`
query SEARCH_ANIME_MANGA($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
      id
      title {
        userPreferred
      }
      coverImage {
        large
        medium
        color
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      bannerImage
      season
      seasonYear
      description(asHtml:true)
      type
      format
      status(version: 2)
      episodes
      duration
      chapters
      volumes
      genres
      isAdult
      averageScore
      popularity
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      mediaListEntry {
        id
        status
      }
      studios(isMain: true) {
        edges {
          isMain
          node {
            id
            name
          }
        }
      }
    }
  }
}

`;


export const SEARCH_STAFF=gql`
query SEARCH_STAFF($page: Int = 1, $id: Int, $search: String, $isBirthday: Boolean, $sort: [StaffSort] = [FAVOURITES_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    staff(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {
      id
      name {
        userPreferred
      }
      description(asHtml:true)
      image {
        large
        medium
      }
    }
  }
}
`

export const SEARCH_CHARACTERS=gql`
query SEARCH_CHARACTERS($page: Int = 1, $id: Int, $search: String, $isBirthday: Boolean, $sort: [CharacterSort] = [FAVOURITES_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    characters(id: $id, search: $search, isBirthday: $isBirthday, sort: $sort) {
      id
      name {
        userPreferred
      }
      description(asHtml:true)
      image {
        large
        medium
      }
    }
  }
}
`

export const SEARCH_STUDIO=gql`
query SEARCH_STUDIO($page: Int = 1, $id: Int, $search: String, $sort: [StudioSort] = [SEARCH_MATCH]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    studios(id: $id, search: $search, sort: $sort) {
      id
      name
    }
  }
}
`