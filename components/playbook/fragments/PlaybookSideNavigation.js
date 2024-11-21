import { useCallback, useContext, useEffect } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import { useIntl } from 'react-intl'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { isDebugLoggingEnabled } from '../../utils/utilities'
import { COMMENTS_SECTION_SLUG_VALUE, PlaybookContext } from './PlaybookContext'

const PlaybookSideNavigation = ({ playbook, playRefs }) => {
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

  const scrollToComment = () => {
    const currentSlug = plays[plays.length - 1].playSlug

    setCurrentSlug(currentSlug)
    setDirectAccess(true)

    if (playRefs && playRefs.current) {
      const scrollTargetRef = playRefs.current[COMMENTS_SECTION_SLUG_VALUE]
      scrollTargetRef?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }

  return (
    <div className='sticky' style={{ top: 'calc(var(--header-height) + var(--filter-height) + 1.5rem)' }}>
      <div className='flex flex-col text-dial-stratos'>
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
        <div className='px-4 lg:px-6 flex flex-col gap-y-3 mt-3'>
          <hr className='border-b border-dial-slate-200' />
          <Bookmark object={playbook} objectType={ObjectType.PLAYBOOK} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
          <div className='flex flex-col gap-3 py-3'>
            <div className='text-dial-sapphire font-semibold'>
              {format('ui.comment.label')}
            </div>
            <div className='text-sm text-dial-stratos'>
              {format('ui.comment.description', { entity: format('ui.playbook.label') })}
            </div>
            <div className='flex text-white'>
              <div className='bg-dial-iris-blue rounded-md text-sm'>
                <button type='button' className='px-5 py-3' onClick={scrollToComment}>
                  {format('ui.comment.buttonTitle')}
                </button>
              </div>
            </div>
          </div>
          <hr className='border-b border-dial-slate-200' />
        </div>
      </div>
    </div>
  )
}

export default PlaybookSideNavigation
