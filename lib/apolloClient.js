import { useMemo } from 'react'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { getSession } from 'next-auth/react'
import { ApolloClient, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER + '/graphql'
})

const getAuthToken = async (request) => {
  const session = await getSession(request)
  const authToken = session?.user?.userToken

  return authToken ? `Bearer ${authToken}` : ''
}

const authMiddleware = setContext(async (_, { request, headers }) => {
  const token = (await getAuthToken(request))

  return {
    headers: {
      ...headers,
      Authorization: token
    }
  }
})

const merge = (existing, incoming, options) => {
  if (!incoming) return existing
  if (!existing) return incoming
  // If there's no 'after' in the arguments of the graph, return server data.
  if (!options.args?.after) return incoming

  if (incoming.nodes.length === existing.nodes.length &&
    incoming.pageInfo.endCursor === existing.pageInfo.endCursor) {
    return existing
  }

  // Default the result to the incoming data
  const result = { ...incoming }
  // Merge existing items with the items from incoming
  const seen = {}
  result.nodes = [...existing.nodes, ...incoming.nodes]
    .filter(node => {
      // TODO: Need to make sure this key is still correct.
      const key = node.__ref

      return seen[key] ? false : (seen[key] = true)
    })

  return result
}

const createApolloClient = () => new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache()
})

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => JSON.stringify(d) !== JSON.stringify(s))
        )
      ]
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const addApolloState = (client, pageProps) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApollo = (pageProps) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])

  return store
}
