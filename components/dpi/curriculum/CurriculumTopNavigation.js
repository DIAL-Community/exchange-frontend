import { useContext, useEffect, useState } from 'react'
import DpiBreadcrumb from '../sections/DpiBreadcrumb'
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

  const slugNameMapping = (() => {
    const map = {}
    map[curriculum.slug] = curriculum.name

    return map
  })()

  return (
    <div className='sticky sticky-under-header bg-dial-lavender'>
      <div className='relative flex px-4 py-6 overflow-x-auto'>
        <div className='absolute top-2 left-8'>
          <DpiBreadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='text-xl px-4 mt-3 font-semibold my-auto'>
          {curriculum.name}
        </div>
        <div className='ml-auto play-progress'>
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
