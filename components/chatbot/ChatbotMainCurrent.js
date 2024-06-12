import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { CREATE_CHATBOT_CONVERSATION } from '../shared/mutation/chatbot'
import { CHATBOT_CONVERSATIONS } from '../shared/query/chatbot'

const ChatbotMainCurrent = ({ existingSessionIdentifier, currentConversation, setCurrentConversation }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [currentQuestion, setCurrentQuestion] = useState('')

  const [mutating, setMutating] = useState(false)
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { user } = useUser()
  const { locale } = useRouter()

  // Handler for the question text input
  const updateCurrentQuestion = (e) => setCurrentQuestion(e.target.value)

  // Handler for the mutation to the backend
  const [createChatbotConversation, { reset }] = useMutation(CREATE_CHATBOT_CONVERSATION, {
    refetchQueries: [{
      query: CHATBOT_CONVERSATIONS,
      variables: {
        currentIdentifier: currentConversation?.identifier ?? '',
        sessionIdentifier: currentConversation?.sessionIdentifier ?? existingSessionIdentifier
      }
    }],
    onCompleted: (data) => {
      const { createChatbotConversation: response } = data
      if (response.chatbotConversation && response.errors.length === 0) {
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.chatbot.question') }))
        setCurrentConversation(response.chatbotConversation)
        setCurrentQuestion('')
        setMutating(false)
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.chatbot.question') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.chatbot.question') }))
      setMutating(false)
      reset()
    }
  })

  const submitQuestion = useCallback(() => {
    if (user && currentQuestion) {
      // Set the loading indicator.
      setMutating(true)
      // Send graph query to the backend. Set the base variables needed to perform update.
      const { userEmail, userToken } = user
      const variables = {
        sessionIdentifier: currentConversation?.sessionIdentifier ?? existingSessionIdentifier,
        chatbotQuestion: currentQuestion
      }

      createChatbotConversation({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }, [createChatbotConversation, currentConversation, existingSessionIdentifier, currentQuestion, locale, user])

  const enterPressedHandler = useCallback((event) => {
    if (event.key === 'Enter') {
      submitQuestion()
    }
  }, [submitQuestion])

  useEffect(() => {
    document.addEventListener('keydown', enterPressedHandler, false)

    return () => {
      document.removeEventListener('keydown', enterPressedHandler, false)
    }
  }, [enterPressedHandler])

  return (
    <div className='flex flex-col'>
      <div className='flex gap-4 text-base mt-auto'>
        <input
          type='text'
          value={currentQuestion}
          onChange={updateCurrentQuestion}
          placeholder='Ask me questions...'
          className='text-sm grow'
          disabled={mutating || !user}
        />
        <button
          type='button'
          onClick={submitQuestion}
          className='submit-button text-sm'
          disabled={mutating || !user || !currentQuestion}
        >
          {`${format('app.submit')}`}
          {mutating && <FaSpinner className='spinner ml-3' />}
        </button>
      </div>
    </div>
  )
}

export default ChatbotMainCurrent
