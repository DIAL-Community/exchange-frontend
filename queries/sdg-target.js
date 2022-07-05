import { gql } from '@apollo/client'

export const SDG_TARGET_SEARCH_QUERY = gql`
  query SdgTargetSearchQuery($search: String!) {
    sdgTargets(search: $search) {
      id
      name
      targetNumber
      sustainableDevelopmentGoal {
        slug
      }
    }
  }
`
