import { useContext, useEffect, useState } from 'react'
import HubBreadcrumb from '../sections/HubBreadcrumb'
import { CurriculumContext } from './CurriculumContext'

const CurriculumTopNavigation = ({ curriculum, moduleRefs }) => {
  const [currentSlugIndex, setCurrentSlugIndex] = useState(0)

  const {
    currentSlug,
    setCurrentSlug,
    setDirectAccess,
    modules
  } = useContext(CurriculumContext)

  const navigateToPlay = (e, slug) => {
    e.preventDefault()
    setCurrentSlug(slug)
    setDirectAccess(true)

    if (moduleRefs && moduleRefs.current) {
      const scrollTargetRef = moduleRefs.current[slug]
      scrollTargetRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  useEffect(() => {
    const currentIndex = modules.findIndex(module => module.moduleSlug === currentSlug)
    setCurrentSlugIndex(currentIndex)
  }, [currentSlug, modules])

  const slugNameMapping = () => {
    const map = {}
    map[curriculum.slug] = curriculum.name

    return map
  }

  return (
    <div className='sticky sticky-under-header bg-dial-lavender'>
      <div className='relative flex flex-col lg:flex-row gap-3 lg:px-4 py-6 overflow-x-auto'>
        <div className='absolute top-2 left-4 lg:left-8'>
          <HubBreadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='text-base lg:text-xl px-4 mt-3 font-semibold my-auto line-clamp-1'>
          {curriculum.name}
        </div>
        <div className='ml-4 mr-4 lg:ml-auto play-progress'>
          <div className='play-progress-bar-base' />
          <div className='play-progress-number'>
            {modules.map(({ moduleSlug }, index) => {
              return (
                <a key={index} href='#' onClick={(e) => navigateToPlay(e, moduleSlug)}>
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

export default CurriculumTopNavigation
