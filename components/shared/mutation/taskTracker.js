import { gql } from '@apollo/client'

export const DELETE_TASK_TRACKER = gql`
  mutation DeleteTaskTracker($id: ID!) {
    deleteTag(id: $id) {
      taskTracker {
        id
      }
      errors
    }
  }
`

export const CREATE_TASK_TRACKER = gql`
  mutation CreateTaskTracker(
    $name: String!
    $slug: String!
    $description: String!
  ) {
    createTaskTracker(
      name: $name
      slug: $slug
      description: $description
    ) {
      taskTracker {
        id
        name
        slug
        taskTrackerDescription {
          id
          description
          locale
        }
      }
      errors
    }
  }
`
