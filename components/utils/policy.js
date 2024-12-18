import { GRAPH_QUERY_CONTEXT_KEY, GRAPH_QUERY_POLICY_SLUG } from '../../lib/apolloClient'

const operationAllowed = (errors, operationName) => {
  let allowed = true
  if (errors && errors.length > 0) {
    errors.forEach(e => {
      if (e.extensions.operation === operationName) {
        allowed = false
      }
    })
  }

  return allowed
}

// Return map of operation and boolean value for each operation
// e.g. { editing: true, deleting: true }
export const fetchOperationPolicies = (client, query, operations, variables = { slug: GRAPH_QUERY_POLICY_SLUG }) => {
  const apolloQuery = client.query({
    query,
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    context: {
      headers: {
        [GRAPH_QUERY_CONTEXT_KEY]: operations.join(', ')
      }
    }
  })

  return apolloQuery.then(response => {
    const policies = {}
    operations.forEach(operation => {
      policies[operation] = operationAllowed(response.errors, operation)
    })

    return policies
  })
}
