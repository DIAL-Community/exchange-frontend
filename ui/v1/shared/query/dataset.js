import { gql } from '@apollo/client'

export const DATASET_SEARCH_QUERY = gql`
  query Datasets($search: String!) {
    datasets(search: $search) {
      id
      name
      slug
    }
  }
`
