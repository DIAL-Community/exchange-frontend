import { gql } from '@apollo/client'

export const CHATBOT_CONVERSATIONS = gql`
  query ChatbotConversations($sessionIdentifier: String!) {
    chatbotConversations(sessionIdentifier: $sessionIdentifier) {
      id
      identifier
      sessionIdentifier
      chatbotAnswer
      chatbotQuestion
    }
  }
`
