import { useEffect, useState } from 'react'
import ChatbotMainCurrent from './ChatbotMainCurrent'
import ChatbotMainHistory from './ChatbotMainHistory'

const ChatbotMain = ({ existingSessionIdentifier }) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const [currentConversation, setCurrentConversation] = useState()

  useEffect(() => {
    if (currentConversation) {
      setCurrentText('')
      setCurrentIndex(0)
    }
  }, [currentConversation])

  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 h-[80vh] bg-dial-angel'>
      <div className='flex flex-col py-6 h-full'>
        <ChatbotMainHistory
          existingSessionIdentifier={existingSessionIdentifier ?? ''}
          currentText={currentText}
          setCurrentText={setCurrentText}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
        />
        <ChatbotMainCurrent
          existingSessionIdentifier={existingSessionIdentifier ?? ''}
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
        />
      </div>
    </div>
  )
}

export default ChatbotMain
