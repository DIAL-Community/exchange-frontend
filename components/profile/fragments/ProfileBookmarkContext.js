import { createContext, useState } from 'react'

const ProfileBookmarkContext = createContext()

const ProfileBookmarkContextProvider = ({ children }) => {
  const [displayUseCases, setDisplayUseCases] = useState(true)
  const [displayProducts, setDisplayProducts] = useState(true)
  const [displayBuildingBlocks, setDisplayBuildingBlocks] = useState(true)
  const [displayUrls, setDisplayUrls] = useState(true)

  const props = {
    displayUseCases,
    displayProducts,
    displayBuildingBlocks,
    displayUrls,
    setDisplayUseCases,
    setDisplayProducts,
    setDisplayBuildingBlocks,
    setDisplayUrls
  }

  return (
    <ProfileBookmarkContext.Provider value={{ ...props }}>
      {children}
    </ProfileBookmarkContext.Provider>
  )
}

export { ProfileBookmarkContextProvider, ProfileBookmarkContext }
