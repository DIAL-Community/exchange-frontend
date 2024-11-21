import { useContext, useEffect, useState } from 'react'
import Breadcrumb from '../../shared/Breadcrumb'
import { PlaybookContext } from './PlaybookContext'

const PlaybookTopNavigation = ({ playbook, playRefs }) => {
  const [currentSlugIndex, setCurrentSlugIndex] = useState(0)

  const {
    currentSlug,
    setCurrentSlug,
    setDirectAccess,
    plays
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
    const currentIndex = plays.findIndex(play => play.playSlug === currentSlug)
    setCurrentSlugIndex(currentIndex)
  }, [currentSlug, plays])

  const slugNameMapping = (() => {
    const map = {}
    map[playbook.slug] = playbook.name

    return map
  })()

  return (
    <div className='sticky sticky-under-header bg-dial-violet'>
      <div className='relative flex flex-col lg:flex-row gap-3 lg:px-4 py-6 overflow-x-auto'>
        <div className='absolute top-2 left-4 lg:left-8'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='text-base lg:text-xl px-4 mt-3 font-semibold my-auto line-clamp-1'>
          {playbook.name}
        </div>
        <div className='ml-4 mr-4 lg:ml-auto play-progress'>
          <div className='play-progress-bar-base' />
          <div className='play-progress-number'>
            {plays.map(({ playSlug }, index) => {
              return (
                <a key={index} href='#' onClick={(e) => navigateToPlay(e, playSlug)}>
                  <div className={`step text-dial-stratos ${index <= currentSlugIndex && 'active'}`}>
                    {index}
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaybookTopNavigation
