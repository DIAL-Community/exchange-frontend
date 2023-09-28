import { gql } from '@apollo/client'

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
