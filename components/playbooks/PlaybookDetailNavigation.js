import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { useContext, useEffect, useState } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { PlaybookDetailContext, PlaybookDetailDispatchContext } from './PlaybookDetailContext'
import { OVERVIEW_SLUG_NAME } from './PlaybookDetailOverview'

export const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      imageFile
      playbookPlays {
        id
        playSlug
        playName
        order
      }
      plays {
        id
        slug
        playMoves {
          id
          name
        }
      }
    }
  }
`

const ACTIVE_NAV_COLOR = 'bg-dial-purple border-dial-yellow'

const PlaybookDetailNavigation = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [centerYPosition, setCenterYPosition] = useState(0)
  const [mappedMoves, setMappedMoves] = useState({})

  const {
    currentSlug, slugYValues, slugHeights, windowHeight, direct
  } = useContext(PlaybookDetailContext)
  const { setCurrentSlug, setDirect } = useContext(PlaybookDetailDispatchContext)

  const { loading, error, data } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug }
  })

  useEffect(() => {
    if (windowHeight) {
      // Playbook header is at 150px on large screens.
      setCenterYPosition(windowHeight / 2)
    }
  }, [windowHeight])

  useEffect(() => {
    if (data && data.playbook) {
      data.playbook.plays.forEach(play => {
        const moves = play.playMoves.map(move => move.name)
        mappedMoves[play.slug] = moves
      })
      setMappedMoves({ ...mappedMoves })
    }
  }, [data])

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

    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    if (!centerYPosition) {
      // Skip execution if we don't have the center boundary yet.
      return
    }

    const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)

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
  }, [centerYPosition, direct, setDirect, currentSlug, setCurrentSlug, slugYValues, slugHeights, data])

  // Loading and error handler section.
  if (loading) {
    return <Loading />
  } else if (error) {
    if (error.networkError) {
      return <Error />
    } else {
      return <NotFound />
    }
  }

  const navigateToPlay = (e, slug) => {
    e.preventDefault()

    setDirect(true)
    setCurrentSlug(slug)
    
    if (!data || !data.playbook) {
      // Skip execution if we don't have the playbook play information.
      return
    }

    let index = 0
    let height = 0
    if (slug !== OVERVIEW_SLUG_NAME) {
      const playSlugs = data.playbook.playbookPlays.map(play => play.playSlug)

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
            hover:border-dial-yellow hover:bg-dial-purple-light hover:text-dial-yellow-light
            ${currentSlug === OVERVIEW_SLUG_NAME ? 'border-dial-purple text-dial-yellow' : 'border-dial-gray-dark'}
          `}
        >
          <div className={`border-l-8 ${currentSlug === OVERVIEW_SLUG_NAME ? `${ACTIVE_NAV_COLOR}` : 'border-transparent'}`}>
            <a href='#navigate-to-play' className='block py-4 px-8' onClick={(e) => navigateToPlay(e, OVERVIEW_SLUG_NAME)}>
              {format('playbooks.overview')}
            </a>
          </div>
        </div>
        {
          data.playbook.playbookPlays.map((playbookPlay, index) => {
            return (
              <div
                key={index}
                className={`
                  border-r-4 border-dial-gray-dark
                  hover:border-dial-yellow hover:bg-dial-purple-light hover:text-dial-yellow-light
                  ${currentSlug === playbookPlay.playSlug ? 'border-dial-purple text-dial-yellow' : 'border-dial-gray-dark'}
                `}
              >
                <a href='#navigate-to-play' className='block' onClick={(e) => navigateToPlay(e, playbookPlay.playSlug)}>
                  <div
                    className={`
                      flex flex-col gap-y-1 border-l-8 py-3 px-8
                      ${currentSlug === playbookPlay.playSlug ? `${ACTIVE_NAV_COLOR}` : 'border-transparent'}
                    `}
                  >
                    {`${format('plays.label')} ${index + 1}. ${playbookPlay.playName}`}
                    {
                      currentSlug === playbookPlay.playSlug && mappedMoves[playbookPlay.playSlug] &&
                        mappedMoves[playbookPlay.playSlug].map((moveName, index) =>
                          <div key={index} className='block'>
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
