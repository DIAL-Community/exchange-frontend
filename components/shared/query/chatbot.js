import { gql } from '@apollo/client'

export const CHATBOT_CONVERSATIONS = gql`
  query ChatbotConversations($sessionIdentifier: String!, $currentIdentifier: String) {
    chatbotConversations(sessionIdentifier: $sessionIdentifier, currentIdentifier: $currentIdentifier) {
      id
      identifier
      sessionIdentifier
      chatbotAnswer
      chatbotQuestion
    }
  }
`

export const CHATBOT_CONVERSATION_STARTERS = gql`
  query ChatbotConversationStarters {
	  chatbotConversationStarters
  }
`
