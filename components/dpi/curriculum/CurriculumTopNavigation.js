import { useContext, useEffect, useState } from 'react'
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

  return (
    <div className='sticky sticky-under-header bg-dial-lavender'>
      <div className='flex px-4 py-6 overflow-x-auto'>
        <div className='px-4 text-xl font-semibold my-auto'>
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
