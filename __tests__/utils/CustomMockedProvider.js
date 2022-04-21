import React from 'react'
import { ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { MockLink, MockedProvider } from '@apollo/client/testing'


export const generateMockApolloData = (graphQuery, graphVariables, errorData, resultData) => {
  const mockedDataStructure = {
    request: {
      query: graphQuery,
      variables: graphVariables
    }
  }

  if (errorData) {
    mockedDataStructure.error = errorData
  }

  if (resultData) {
    mockedDataStructure.result = resultData
  }

  return mockedDataStructure
}

const CustomMockedProvider = (props) => {
  // Pass the allowDebugMessage prop to print debug message
  const { mocks, allowDebugMessage, ...otherProps } = props

  const mockLink = new MockLink(mocks)
  const errorLoggingLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors && allowDebugMessage) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      )
    }

    if (networkError && allowDebugMessage) {
      console.log(`[Network error]: ${networkError}`)
    }
  })
  const link = ApolloLink.from([errorLoggingLink, mockLink])

  return <MockedProvider {...otherProps} link={link} />
}

export default CustomMockedProvider
