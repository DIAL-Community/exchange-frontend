import { createContext, useState } from 'react'

const BookmarkDisplayContext = createContext()

const BookmarkDisplayContextProvider = ({ children }) => {
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
    <BookmarkDisplayContext.Provider value={{ ...props }}>
      {children}
    </BookmarkDisplayContext.Provider>
  )
}

export { BookmarkDisplayContextProvider, BookmarkDisplayContext }
