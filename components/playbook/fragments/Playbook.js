import { useCallback, useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { PlaybookContext, OVERVIEW_SLUG_VALUE } from './PlaybookContext'
import PlaybookHeader from './PlaybookHeader'
import PlaybookPlays from './PlaybookPlays'
import PlaybookSideNavigation from './PlaybookSideNavigation'
import PlaybookTopNavigation from './PlaybookTopNavigation'

const Playbook = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const playRefs = useRef({})

  const {
    setPlays,
    setPlayNames,
    setPlayMoveNames
  } = useContext(PlaybookContext)

  useEffect(() => {
    const { plays, playbookPlays } = playbook
    if (plays) {
      setPlays([
        {
          playId: 0,
          playName: format('ui.playbook.overview'),
          playSlug: OVERVIEW_SLUG_VALUE,
          playOrder: 0
        },
        ...playbookPlays
          .map(playbookPlay => ({
            playId: playbookPlay.id,
            playName: playbookPlay.playName,
            playSlug: playbookPlay.playSlug,
            playOrder: playbookPlay.playOrder + 1
          }))
          .sort((a, b) => a.playOrder - b.playOrder)
      ])

      setPlayNames(previousPlayNames => {
        const currentPlayNames = { ...previousPlayNames }
        currentPlayNames[OVERVIEW_SLUG_VALUE] = format('ui.playbook.overview')
        plays.forEach(play => {
          currentPlayNames[play.slug] = play.name
        })

        return currentPlayNames
      })

      setPlayMoveNames(previousPlayMoveNames => {
        const currentPlayMoveNames = { ...previousPlayMoveNames }
        plays.forEach(play => {
          const { playMoves } = play
          const playMoveNames = playMoves.map(playMove => playMove.name)
          currentPlayMoveNames[play.slug] = playMoveNames
        })

        return currentPlayMoveNames
      })
    }
  }, [format, playbook, setPlays, setPlayNames, setPlayMoveNames])

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col min-h-[80vh]'>
      <PlaybookTopNavigation playbook={playbook} playRefs={playRefs} />
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <PlaybookSideNavigation playbook={playbook} playRefs={playRefs} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <div className='px-4 lg:px-0 py-4'>
            <div className='flex flex-col gap-y-3'>
              <PlaybookHeader playbook={playbook} playRefs={playRefs} />
              <PlaybookPlays playbook={playbook} playRefs={playRefs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Playbook
