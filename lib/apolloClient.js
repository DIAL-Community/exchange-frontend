import { withApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const merge = (existing, incoming, options) => {
  if (!incoming) return existing
  if (!existing) return incoming

  // If there's no 'after' in the arguments of the graph, return server data. 
  if (!options.args.after) return incoming

  if (incoming.nodes.length === existing.nodes.length &&
    incoming.pageInfo.endCursor === existing.pageInfo.endCursor) {
    return existing
  }
  
  // Default the result to the incoming data
  const result = { ...incoming }
  // Merge existing items with the items from incoming
  result.nodes = [...existing.nodes, ...incoming.nodes]
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
              'buildingBlocks', 'productDeployable', 'withMaturity', 'search', 'sortColumn', 'sortDirection'
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
            keyArgs: ['origins', 'countries', 'sectors', 'organizations', 'sdgs', 'tags', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchOrganizations: {
            keyArgs: ['countries', 'sectors', 'years', 'search', 'endorserOnly', 'aggregatorOnly', 'aggregators', 'sortColumn', 'sortDirection'],
            merge
          },
          capabilities: {
            keyArgs: ['capabilities', 'services', 'countryIds', 'aggregatorIds'],
            merge
          },
          operatorServices: {
            keyArgs: ['operators', 'operatorIds'],
            merge
          },
          countries: {
            keyArgs: ['search'],
            merge
          },
        }
      }
    }
  })
})

export default withApollo(apolloClient)
