import { useCallback, useContext, useEffect } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { isDebugLoggingEnabled } from '../../utils/utilities'
import { PlaybookContext } from './PlaybookContext'

const PlaybookSideNavigation = ({ playRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    currentSlug,
    setCurrentSlug,
    plays,
    playNames,
    playMoveNames,
    playPercentages,
    directAccess,
    setDirectAccess
  } = useContext(PlaybookContext)

  const navigateToPlay = (e, slug) => {
    e.preventDefault()
    setCurrentSlug(slug)
    setDirectAccess(true)

    if (playRefs && playRefs.current) {
      const scrollTargetRef = playRefs.current[slug]
      scrollTargetRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  useEffect(() => {
    const findPlayWithHighestPercentage = () => {
      let currentMaxIndex = 0
      let { playSlug: currentMaxPlaySlug } = plays[currentMaxIndex]
      let currentMaxPercentage = playPercentages[currentMaxPlaySlug]

      for (let i = 1; i < plays.length; i++) {
        let { playSlug: currentMaxPlaySlug } = plays[i]
        if (playPercentages[currentMaxPlaySlug] >= currentMaxPercentage) {
          currentMaxIndex = i
          currentMaxPercentage = playPercentages[currentMaxPlaySlug]
        }
      }

      return plays[currentMaxIndex]
    }

    const eventHandler = (event) => {
      if (isDebugLoggingEnabled()) {
        console.log('Scroll event triggered. Event data: ', event)
      }

      if (directAccess) {
        setDirectAccess(false)
      } else {
        const { playSlug } = findPlayWithHighestPercentage()
        setCurrentSlug(playSlug)
        setDirectAccess(false)
      }
    }

    document.addEventListener('scrollend', eventHandler)

    return () => {
      document.removeEventListener('scrollend', eventHandler)
    }
  }, [directAccess, setDirectAccess, plays, playPercentages, setCurrentSlug])

  return (
    <div className='sticky' style={{ top: 'calc(var(--header-height) + var(--filter-height) + 1.5rem)' }}>
      <div className=' flex flex-col text-dial-stratos'>
        {plays
          .map(play => play.playSlug)
          .map((playSlug, index) => (
            <div
              key={`play-${index}`}
              className={currentSlug === playSlug ? 'bg-dial-slate-500' : undefined}
            >
              <a
                href={`/navigate-to-${playSlug}`}
                onClick={(e) => navigateToPlay(e, playSlug)}
              >
                <div className={currentSlug === playSlug ? 'bg-dial-slate-500 text-dial-cotton' : undefined}>
                  <div className='flex flex-col gap-y-1 py-3 px-4 lg:px-8'>
                    {index <= 0
                      ? playNames[playSlug]
                      : `${format('ui.play.label')} ${index}. ${playNames[playSlug]}`
                    }
                    {
                      currentSlug === playSlug &&
                      playMoveNames[playSlug] &&
                      playMoveNames[playSlug].map((playMoveName, index) =>
                        <div key={`playbook-play-move-${index}`} className='flex gap-x-2'>
                          <MdPlayArrow size='0.8rem' className='my-auto' />
                          {playMoveName}
                        </div>
                      )
                    }
                  </div>
                </div>
              </a>
            </div>
          ))}
      </div>
    </div>
  )
}

export default PlaybookSideNavigation
