import { useIntl } from 'react-intl'
import { MdPlayArrow } from 'react-icons/md'
import { useCallback, useContext, useEffect, useState } from 'react'
import { PlaybookDetailContext, PlaybookDetailDispatchContext } from '../context/PlaybookDetailContext'
import { OVERVIEW_SLUG_NAME } from './PlaybookDetailOverview'

const PlaybookDetailNavigation = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [mappedMoves, setMappedMoves] = useState({})

  const { currentSlug, slugHeights } = useContext(PlaybookDetailContext)
  const { setCurrentSlug } = useContext(PlaybookDetailDispatchContext)

  useEffect(() => {
    if ( playbook) {
      setMappedMoves(previousMappedMoves => {
        const moves = { ...previousMappedMoves }
        playbook.plays.forEach(play => {
          const playMoves = play.playMoves.map(move => move.name)
          moves[play.slug] = playMoves
        })

        return moves
      })
    }
  }, [playbook])

  const navigateToPlay = (e, slug) => {
    e.preventDefault()

    setCurrentSlug(slug)

    let index = 0
    let height = 0
    if (slug !== OVERVIEW_SLUG_NAME) {
      const playSlugs = playbook.playbookPlays.map(play => play.playSlug)

      height = slugHeights[OVERVIEW_SLUG_NAME]
      while (index < playSlugs.length && playSlugs[index] !== slug) {
        height = height + slugHeights[playSlugs[index]]
        index = index + 1
      }
    }

    window.scrollTo({
      top: height,
      behavior: 'smooth'
    })
  }

  return (
    <div className='flex flex-col text-dial-stratos'>
      <div className={currentSlug === OVERVIEW_SLUG_NAME ? 'hover:bg-dial-slate-300' : undefined}>
        <div className={currentSlug === OVERVIEW_SLUG_NAME ? 'bg-dial-slate-500 text-white' : undefined}>
          <a href='#' onClick={(e) => navigateToPlay(e, OVERVIEW_SLUG_NAME)}>
            <div className='py-4 px-8'>
              {format('ui.playbook.overview')}
            </div>
          </a>
        </div>
      </div>
      {playbook.playbookPlays.map((playbookPlay, index) => {
        return (
          <div
            key={`playbook-plays-${index}`}
            className={currentSlug === playbookPlay.playSlug ? 'bg-dial-slate-500' : undefined}
          >
            <a href='#' onClick={(e) => navigateToPlay(e, playbookPlay.playSlug)}>
              <div className={currentSlug === playbookPlay.playSlug ? 'bg-dial-slate-500 text-white' : undefined}>
                <div className='flex flex-col gap-y-1 py-3 px-8'>
                  {`${format('ui.play.label')} ${index + 1}. ${playbookPlay.playName}`}
                  {currentSlug === playbookPlay.playSlug && mappedMoves[playbookPlay.playSlug] &&
                    mappedMoves[playbookPlay.playSlug].map((moveName, index) =>
                      <div key={`playbook-play-move-${index}`} className='flex gap-x-2'>
                        <MdPlayArrow size='0.8rem' className='my-auto' />
                        {moveName}
                      </div>
                    )
                  }
                </div>
              </div>
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default PlaybookDetailNavigation
