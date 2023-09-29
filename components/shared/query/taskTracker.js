import { gql } from '@apollo/client'

export const TASK_TRACKER_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeTaskTracker($search: String) {
    paginationAttributeTaskTracker(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_TASK_TRACKERS_QUERY = gql`
  query PaginatedTaskTrackers(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedTaskTrackers(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      taskCompleted
      lastStartedDate
      taskTrackerDescription {
        id
        description
        locale
      }
    }
  }
`

export const TASK_TRACKER_DETAIL_QUERY = gql`
  query TaskTracker($slug: String!) {
    taskTracker(slug: $slug) {
      id
      name
      slug
      taskCompleted
      lastStartedDate
      lastReceivedMessage
      taskTrackerDescription {
        id
        description
        locale
      }
    }
  }
`
