import { FaRobot, FaUser } from 'react-icons/fa6'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { CHATBOT_CONVERSATIONS } from '../shared/query/chatbot'

const ChatbotMainHistory = ({ sessionIdentifier }) => {

  const { loading, error, data } = useQuery(CHATBOT_CONVERSATIONS, {
    variables: { sessionIdentifier }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.chatbotConversations) {
    return <NotFound />
  }

  const { chatbotConversations } = data
  const avatarCssText = 'rounded-full w-8 h-8 flex items-center justify-center'

  return (
    <div className='flex flex-col gap-8 h-full overflow-hidden'>
      <div className='text-xl'>History</div>
      <div className='flex flex-col gap-4 overflow-auto text-sm'>
        {chatbotConversations.map(conversation => (
          <div
            key={conversation.identifier}
            className='flex flex-col gap-4'
          >
            <div className='flex gap-3'>
              <div className={`flex-shrink-0 bg-dial-sapphire text-white ${avatarCssText}`}>
                <FaUser />
              </div>
              <div className='my-auto'>
                {conversation.chatbotQuestion}
              </div>
            </div>
            <div className='flex gap-3'>
              <div className={`flex-shrink-0 bg-dial-sapphire text-white ${avatarCssText}`}>
                <FaRobot />
              </div>
              <div className='my-auto'>
                {conversation.chatbotAnswer}
              </div>
            </div>
            <hr className='my-3' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatbotMainHistory
