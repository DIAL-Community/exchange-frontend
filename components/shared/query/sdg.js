import { gql } from '@apollo/client'

export const SDG_SEARCH_QUERY = gql`
  query Sdgs($search: String) {
    sdgs(search: $search) {
      id
      name
      slug
      number
    }
  }
`

export const SDG_LIST_QUERY = gql`
  query Sdgs($search: String) {
    sdgs(search: $search) {
      id
      name
      slug
      number
      longTitle
      imageFile
      sdgTargets {
        id
      }
    }
  }
`

export const SDG_DETAIL_QUERY = gql`
  query SDG($slug: String!) {
    sdg(slug: $slug) {
      id
      name
      slug
      number
      imageFile
      longTitle
      sdgTargets {
        id
        name
        targetNumber
        imageFile
      }
    }
  }
`
