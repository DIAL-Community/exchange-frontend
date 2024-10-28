import { GRAPH_QUERY_CONTEXT_KEY, GRAPH_QUERY_POLICY_SLUG } from '../../lib/apolloClient'

const operationAllowed = (error, operationName) => {
  if (error?.graphQLErrors) {
    const { graphQLErrors } = error
    if (graphQLErrors.length > 0) {
      graphQLErrors.forEach(e => {
        if (e.extensions.operation === operationName) {
          return true
        }
      })
    }
  }

  return false
}

// Return map of operation and boolean value for each operation
// e.g. { editing: true, deleting: true }
export const fetchOperationPolicies = async (client, query, operations, variables = { slug: GRAPH_QUERY_POLICY_SLUG }) => {
  const response = await client.query({
    query,
    variables,
    errorPolicy: 'all',
    context: {
      headers: {
        [GRAPH_QUERY_CONTEXT_KEY]: operations.join(', ')
      }
    }
  })

  const policies = {}
  operations.forEach(operation => {
    policies[operation] = operationAllowed(response.error, operation)
  })

  return policies
}
