import { useIntl } from 'react-intl'
import { useContext, useEffect, useState } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import { PlaybookDetailContext, PlaybookDetailDispatchContext } from './PlaybookDetailContext'
import { OVERVIEW_SLUG_NAME } from './PlaybookDetailOverview'

const ACTIVE_NAV_COLOR = 'bg-dial-purple border-dial-sunshine'

const PlaybookDetailNavigation = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [centerYPosition, setCenterYPosition] = useState(0)
  const [mappedMoves, setMappedMoves] = useState({})

  const {
    currentSlug, slugYValues, slugHeights, windowHeight, direct
  } = useContext(PlaybookDetailContext)
  const { setCurrentSlug, setDirect } = useContext(PlaybookDetailDispatchContext)

  useEffect(() => {
    if (windowHeight) {
      // Playbook header is at 150px on large screens.
      setCenterYPosition(windowHeight / 2)
    }
  }, [windowHeight])

  useEffect(() => {
    if ( playbook) {
      playbook.plays.forEach(play => {
        const moves = play.playMoves.map(move => move.name)
        mappedMoves[play.slug] = moves
      })
      setMappedMoves({ ...mappedMoves })
    }
  }, [playbook])

  useEffect(() => {
    // This will read the state of the context, and update the active slug.
    // Executed when user scrolling through the content of the playbook play list.

    if (direct) {
      const slugHeight = slugHeights[currentSlug]
      const slugYValue = slugYValues[currentSlug]
      if (centerYPosition > slugYValue && centerYPosition < slugYValue + slugHeight) {
        setDirect(false)
      }

      return
    }

    if (!playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    if (!centerYPosition) {
      // Skip execution if we don't have the center boundary yet.
      return
    }

    const playSlugs = playbook.playbookPlays.map(play => play.playSlug)

    // Find slug in the boundary of the screen.
    let index = 0
    let found = false
    while (index < playSlugs.length && !found) {
      const playSlug = playSlugs[index]
      const slugHeight = slugHeights[playSlug]
      const slugYValue = slugYValues[playSlug]
      if (centerYPosition > slugYValue && centerYPosition < slugYValue + slugHeight) {
        // If slug is within the boundary, then this is could be the active slug.
        setCurrentSlug(playSlug)
        found = true
      }

      index = index + 1
    }

    if (!found) {
      // Edge cases for last element and first element.
      const slugYValue = slugYValues[currentSlug]
      const currentSlugIndex = playSlugs.indexOf(currentSlug)
      if (currentSlugIndex === 0 && slugYValue > centerYPosition) {
        setCurrentSlug(OVERVIEW_SLUG_NAME)
      }
    }
  }, [centerYPosition, direct, setDirect, currentSlug, setCurrentSlug, slugYValues, slugHeights, playbook])

  const navigateToPlay = (e, slug) => {
    e.preventDefault()

    setDirect(true)
    setCurrentSlug(slug)

    if (!playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    let index = 0
    let height = 0
    if (slug !== OVERVIEW_SLUG_NAME) {
      const playSlugs = playbook.playbookPlays.map(play => play.playSlug)

      height = slugHeights[OVERVIEW_SLUG_NAME]
      while (index < playSlugs.length && playSlugs[index] !== slug) {
        height = height + slugHeights[playSlugs[index]] + (16 * 1.5)
        index = index + 1
      }
    }

    window.scrollTo({
      top: height,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className='bg-dial-gray-dark sticky h-full overflow-y-auto border-dial-gray-dark'
      style={{ left: 0, top: '150px', height: 'calc(100vh - 150px)' }}
    >
      <div className='flex flex-col text-white'>
        <div
          className={`
            border-r-4 border-dial-gray-dark
            hover:border-dial-sunshine hover:bg-dial-purple-light hover:text-dial-biscotti
            ${currentSlug === OVERVIEW_SLUG_NAME ? 'border-dial-purple text-dial-sunshine' : 'border-dial-gray-dark'}
          `}
        >
          <div className={`border-l-8 ${currentSlug === OVERVIEW_SLUG_NAME ? `${ACTIVE_NAV_COLOR}` : 'border-transparent'}`}>
            <a href='#navigate-to-play' className='block py-4 px-8' onClick={(e) => navigateToPlay(e, OVERVIEW_SLUG_NAME)}>
              {format('ui.playbook.overview')}
            </a>
          </div>
        </div>
        {
          playbook.playbookPlays.map((playbookPlay, index) => {
            return (
              <div
                key={`playbook-plays-${index}`}
                className={`
                  border-r-4 border-dial-gray-dark
                  hover:border-dial-sunshine hover:bg-dial-purple-light hover:text-dial-biscotti
                  ${
                    currentSlug === playbookPlay.playSlug
                      ? 'border-dial-purple text-dial-sunshine'
                      : 'border-dial-gray-dark'
                  }
                `}
              >
                <a href='#navigate-to-play' className='block' onClick={(e) => navigateToPlay(e, playbookPlay.playSlug)}>
                  <div
                    className={`
                      flex flex-col gap-y-1 border-l-8 py-3 px-8
                      ${currentSlug === playbookPlay.playSlug ? `${ACTIVE_NAV_COLOR}` : 'border-transparent'}
                    `}
                  >
                    {`${format('ui.play.label')} ${index + 1}. ${playbookPlay.playName}`}
                    {
                      currentSlug === playbookPlay.playSlug && mappedMoves[playbookPlay.playSlug] &&
                        mappedMoves[playbookPlay.playSlug].map((moveName, index) =>
                          <div key={`playbook-play-move-${index}`} className='block'>
                            <MdPlayArrow size='0.8rem' className='inline mr-2 my-auto' />{moveName}
                          </div>
                        )
                    }
                  </div>
                </a>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default PlaybookDetailNavigation
