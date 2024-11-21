import { createContext, useState } from 'react'

export const OVERVIEW_SLUG_VALUE = 'base-slug-overview-information'
export const COMMENTS_SECTION_SLUG_VALUE = 'base-slug-comments-section'

const PlaybookContext = createContext()

const PlaybookContextProvider = ({ children }) => {
  // Currently active slug
  const [currentSlug, setCurrentSlug] = useState(OVERVIEW_SLUG_VALUE)
  // List of plays ordered by the defined ordering (playOrder field).
  const [plays, setPlays] = useState([])
  // Map of play slugs to play names.
  const [playNames, setPlayNames] = useState({})
  // Map of move slugs to list of move names.
  const [playMoveNames, setPlayMoveNames] = useState({})
  // Map of play slugs to percentage of displayed plays.
  const [playPercentages, setPlayPercentages] = useState({})
  // Whether user is directly navigating to a play.
  const [directAccess, setDirectAccess] = useState(false)

  const values = {
    currentSlug,
    setCurrentSlug,

    plays,
    playNames,
    playMoveNames,
    playPercentages,

    setPlays,
    setPlayNames,
    setPlayMoveNames,
    setPlayPercentages,

    directAccess,
    setDirectAccess
  }

  return (
    <PlaybookContext.Provider value={values}>
      {children}
    </PlaybookContext.Provider>
  )

}

export { PlaybookContextProvider, PlaybookContext }
