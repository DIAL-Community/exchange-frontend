import { withApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const merge = (existing, incoming, args) => {
  if (!incoming) return existing
  if (!existing) return incoming

  if (incoming.nodes.length === existing.nodes.length &&
    incoming.pageInfo.endCursor === existing.pageInfo.endCursor) {
    return existing
  }

  // existing will be empty the first time
  const { nodes, ...rest } = incoming

  const result = rest

  // Merge existing items with the items from incoming
  result.nodes = [...existing.nodes, ...nodes]
  return result
}

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER + '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchProducts: {
            keyArgs: [
              'origins', 'sectors', 'countries', 'organizations', 'productTypes', 'sdgs', 'useCases', 'workflows',
              'buildingBlocks', 'productDeployable', 'search', 'sortColumn', 'sortDirection'
            ],
            merge
          },
          searchBuildingBlocks: {
            keyArgs: ['sdgs', 'useCases', 'workflows', 'showMature', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchWorkflows: {
            keyArgs: ['sdgs', 'useCases', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchUseCases: {
            keyArgs: ['sdgs', 'showBeta', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchSdgs: {
            keyArgs: ['sdgs', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchProjects: {
            keyArgs: ['origins', 'countries', 'sectors', 'organizations', 'sdgs', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchOrganizations: {
            keyArgs: ['countries', 'sectors', 'search', 'aggregatorOnly', 'sortColumn', 'sortDirection'],
            merge
          }
        }
      }
    }
  })
})

export default withApollo(apolloClient)
