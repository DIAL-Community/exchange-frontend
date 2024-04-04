import { useState } from 'react'
import ChatbotMainCurrent from './ChatbotMainCurrent'
import ChatbotMainHistory from './ChatbotMainHistory'

const ChatbotMain = () => {
  const [sessionIdentifier, setSessionIdentifier] = useState('')

  return (
    <div className='px-4 lg:px-8 xl:px-56 h-[65vh] bg-dial-angel'>
      <div className='flex flex-col py-8 h-full'>
        <ChatbotMainHistory
          sessionIdentifier={sessionIdentifier}
          setSessionIdentifier={setSessionIdentifier}
        />
        <ChatbotMainCurrent
          sessionIdentifier={sessionIdentifier}
          setSessionIdentifier={setSessionIdentifier}
        />
      </div>
    </div>
  )
}

export default ChatbotMain
