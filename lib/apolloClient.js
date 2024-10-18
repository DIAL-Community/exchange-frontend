import { useMemo } from 'react'
import { createUploadLink } from 'apollo-upload-client'
import { getSession } from 'next-auth/react'
import { ApolloClient, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { isDebugLoggingEnabled } from '../components/utils/utilities'

let client = null

export const GRAPH_QUERY_CONTEXT = {
  EDITING: { 'Xchange-Graph-Query-Context': 'editing' },
  VIEWING: { 'Xchange-Graph-Query-Context': 'viewing' },
  CREATING: { 'Xchange-Graph-Query-Context': 'creating' },
  DELETING: { 'Xchange-Graph-Query-Context': 'deleting' }
}

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER + '/graphql'
})

const getAuthToken = async (request) => {
  const session = await getSession(request)
  const authToken = session?.user?.userToken

  return authToken ? `Bearer ${authToken}` : ''
}

const queryContextLink = setContext(async (graphQuery, { headers }) => {
  if (isDebugLoggingEnabled()) {
    const { operationName } = graphQuery
    console.log('Setting up graph context for operation:', operationName)
  }

  return {
    headers: {
      ...GRAPH_QUERY_CONTEXT.EDITING,
      ...headers
    }
  }
})

const authContextLink = setContext(async (graphQuery, { request, headers }) => {
  if (isDebugLoggingEnabled()) {
    const { operationName } = graphQuery
    console.log('Setting up auth header for operation:', operationName)
  }

  const token = (await getAuthToken(request))

  return {
    headers: {
      Authorization: token,
      ...headers
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('[GraphQL Error]: ', graphQLErrors)
  }

  if (networkError) {
    console.log('[Network Error]: ', networkError)
  }
})

const createApolloClient = () => new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([queryContextLink, authContextLink, errorLink, httpLink]),
  cache: new InMemoryCache()
})

export const initializeApollo = () => {
  const apolloClient = client ?? createApolloClient()

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return apolloClient
  }

  // Create the Apollo Client once in the client
  if (!client) {
    client = apolloClient
  }

  return apolloClient
}

export const useApollo = () => {
  const store = useMemo(() => initializeApollo(), [])

  return store
}
