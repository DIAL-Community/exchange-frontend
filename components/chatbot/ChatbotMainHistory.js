import { useCallback, useEffect, useRef } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaBookmark, FaRobot, FaSpinner, FaUser } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { CHATBOT_CONVERSATIONS } from '../shared/query/chatbot'

const ChatbotMainHistory = ({ existingSessionIdentifier, currentConversation, ...props }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentIndex, setCurrentIndex, currentText, setCurrentText } = props
  const { identifier, sessionIdentifier, chatbotQuestion, chatbotAnswer, chatbotReferences } = currentConversation ?? {}

  const AVATAR_CSS_TEXT = 'rounded-full w-8 h-8 flex items-center justify-center'

  const { asPath, query: { uuid } } = useRouter()
  const { loadingUserSession, user } = useUser()

  const { loading, error, data } = useQuery(CHATBOT_CONVERSATIONS, {
    variables: {
      currentIdentifier: identifier ?? '',
      sessionIdentifier: sessionIdentifier ?? existingSessionIdentifier
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
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
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.chatbotConversations) {
    return handleMissingData()
  }

  const { chatbotConversations } = data

  const formatText = (text) => {
    const doubleStarParts = text.split('**')
    const formattedDoubleStar = doubleStarParts
      .map((part, index) => index % 2 !== 0 ? `<strong>${part}</strong>` : part)
      .join('')
    const formattedText = formattedDoubleStar.replace(/\n/g, '<br />')

    return formattedText
  }

  return (
    <div className='flex flex-col gap-6 h-full overflow-hidden'>
      <div className='flex'>
        <div className='text-xl'>History</div>
        {currentConversation && !uuid && user &&
          <Link
            className='text-xs ml-auto my-auto border-b border-transparent hover:border-dial-sapphire py-1'
            href={`${asPath.indexOf('/hub') >= 0 ? '' : '/'}chatbot/${currentConversation.sessionIdentifier}`}
          >
            {format('ui.chatbot.viewSession')}
          </Link>
        }
        {uuid && user &&
          <Link
            className='text-xs ml-auto my-auto border-b border-transparent hover:border-dial-sapphire py-1'
            href={`${asPath.indexOf('/hub') >= 0 ? '/hub/dashboard/' : '/'}chatbot`}
          >
            {format('ui.chatbot.createSession')}
          </Link>
        }
      </div>
      <div className='flex flex-col gap-2 overflow-auto text-sm' ref={containerElementRef}>
        {loadingUserSession && <FaSpinner size='2em' className='absolute text-lg inset-x-1/2 top-10 spinner' />}
        {!loadingUserSession && !user &&
          <div className='flex flex-col gap-4'>
            {format('ui.chatbot.userRequired')}
          </div>
        }
        {chatbotConversations
          .filter((_element, index) => index < chatbotConversations.length)
          .map(conversation => (
            <div
              key={conversation.identifier}
              className='flex flex-col gap-4'
            >
              <div className='flex gap-3'>
                <div className={`shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                  <FaUser />
                </div>
                <div className='my-auto'>
                  {conversation.chatbotQuestion}
                </div>
              </div>
              <div className='flex gap-3'>
                <div className={`shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                  <FaRobot />
                </div>
                <div className='my-auto'>
                  {parse(formatText(conversation.chatbotAnswer))}
                </div>
              </div>
              <div className='flex gap-3'>
                <div className={`shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                  <FaBookmark />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='text-sm font-semibold'>
                    {format('ui.chatbot.references')}:
                  </div>
                  {conversation.chatbotReferences?.map((reference, index) => (
                    <div key={index} className='flex gap-2'>
                      <div className='my-auto'>
                        <Link
                          className='border-b border-transparent hover:border-dial-sapphire py-1'
                          href={reference}
                          target='_blank'
                          rel='noreferrer'
                        >
                          {reference}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <hr className='my-3' />
            </div>
          ))
        }
        {currentConversation &&
          <div className='flex flex-col gap-4'>
            <div className='flex gap-2'>
              <div className={`shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                <FaUser />
              </div>
              <div className='my-auto'>
                {chatbotQuestion}
              </div>
            </div>
            <div className='flex gap-2'>
              <div className={`shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                <FaRobot />
              </div>
              <div className='my-auto'>
                {parse(formatText(currentText))}
              </div>
            </div>
            <div className='flex gap-3'>
              <div className={`shrink-0 bg-dial-sapphire text-white ${AVATAR_CSS_TEXT}`}>
                <FaBookmark />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='text-sm font-semibold'>
                  {format('ui.chatbot.references')}:
                </div>
                {chatbotReferences.map((reference, index) => (
                  <div key={index} className='flex gap-2'>
                    <div className='my-auto'>
                      <Link
                        className='border-b border-transparent hover:border-dial-sapphire py-1'
                        href={reference}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {reference}
                      </Link>
                    </div>
                  </div>
                ))}
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
