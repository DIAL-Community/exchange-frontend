import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaRobot, FaUser } from 'react-icons/fa6'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { CHATBOT_CONVERSATIONS } from '../shared/query/chatbot'

const ChatbotMainHistory = ({ existingSessionIdentifier, currentConversation, ...props }) => {
  const { currentIndex, setCurrentIndex, currentText, setCurrentText } = props
  const { identifier, sessionIdentifier, chatbotQuestion, chatbotAnswer } = currentConversation ?? {}

  const AVATAR_CSS_TEXT = 'rounded-full w-8 h-8 flex items-center justify-center'

  console.log('Here')

  const { query: { uuid } } = useRouter()

  const { loading, error, data } = useQuery(CHATBOT_CONVERSATIONS, {
    variables: {
      currentIdentifier: identifier ?? '',
      sessionIdentifier: sessionIdentifier ?? existingSessionIdentifier
    }
  })

  // Scroll last element to the view when we get more data from the query.
  const containerElementRef = useRef(null)
  useEffect(() => {
    if (data) {
      containerElementRef.current?.scroll({
        top: containerElementRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [containerElementRef, data])

  useEffect(() => {
    if (chatbotAnswer) {
      if (currentIndex < chatbotAnswer.length) {
        const timeout = setTimeout(() => {
          setCurrentText(prevText => prevText + chatbotAnswer[currentIndex])
          setCurrentIndex(prevIndex => prevIndex + 1)
        }, 10)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentIndex, setCurrentIndex, setCurrentText, chatbotAnswer])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.chatbotConversations) {
    return <NotFound />
  }

  const { chatbotConversations } = data

  return (
    <div className='flex flex-col gap-6 h-full overflow-hidden'>
      <div className='flex'>
        <div className='text-xl'>History</div>
        {currentConversation && !uuid &&
          <Link
            className='text-xs ml-auto my-auto border-b border-transparent hover:border-dial-sapphire py-1'
            href={`/chatbot/${currentConversation.sessionIdentifier}`}
          >
            View Current Conversation
          </Link>
        }
        {uuid &&
          <Link
            className='text-xs ml-auto my-auto border-b border-transparent hover:border-dial-sapphire py-1'
            href='/chatbot'
          >
            Create Separate Session
          </Link>
        }
      </div>
      <div className='flex flex-col gap-2 overflow-auto text-sm' ref={containerElementRef}>
        {chatbotConversations
          .filter((_element, index) => index < chatbotConversations.length)
          .map(conversation => (
            <div
              key={conversation.identifier}
              className='flex flex-col gap-4'
            >
              <div className='flex gap-3'>
                <div className={`flex-shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                  <FaUser />
                </div>
                <div className='my-auto'>
                  {conversation.chatbotQuestion}
                </div>
              </div>
              <div className='flex gap-2'>
                <div className={`flex-shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                  <FaRobot />
                </div>
                <div className='my-auto'>
                  {conversation.chatbotAnswer}
                </div>
              </div>
              <hr className='my-3' />
            </div>
          ))
        }
        {currentConversation &&
          <div className='flex flex-col gap-4'>
            <div className='flex gap-3'>
              <div className={`flex-shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                <FaUser />
              </div>
              <div className='my-auto'>
                {chatbotQuestion}
              </div>
            </div>
            <div className='flex gap-2'>
              <div className={`flex-shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                <FaRobot />
              </div>
              <div className='my-auto'>
                {currentText}
              </div>
            </div>
            <hr className='my-3' />
          </div>
        }
      </div>
    </div>
  )
}

export default ChatbotMainHistory
