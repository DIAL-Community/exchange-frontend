import { gql } from '@apollo/client'

export const OPERATOR_SEARCH_QUERY = gql`
  query OperatorServiceOnly($search: String!) {
    operatorServiceOnly(search: $search) {
      name
    }
  }
`
