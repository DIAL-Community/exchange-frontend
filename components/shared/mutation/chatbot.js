import { gql } from '@apollo/client'

export const CREATE_CHATBOT_CONVERSATION = gql`
  mutation CreateChatbotConversation($sessionIdentifier: String!, $chatbotQuestion: String!) {
    createChatbotConversation(sessionIdentifier: $sessionIdentifier, chatbotQuestion: $chatbotQuestion) {
      chatbotConversation {
        identifier
        sessionIdentifier
        chatbotAnswer
        chatbotQuestion
        chatbotReferences(first: 2)
      }
      errors
    }
  }
`
