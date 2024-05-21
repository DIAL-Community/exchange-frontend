import { useCallback, useContext } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { CurriculumContext } from './CurriculumContext'
import { OVERVIEW_SLUG_NAME } from './CurriculumDetail'

const CurriculumNavigation = ({ moduleRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    currentSlug,
    setCurrentSlug,
    modules,
    moduleNames,
    subModuleNames
  } = useContext(CurriculumContext)

  const navigateToPlay = (e, slug) => {
    e.preventDefault()
    setCurrentSlug(slug)

    if (moduleRefs && moduleRefs.current) {
      const scrollTargetRef = moduleRefs.current[slug]
      scrollTargetRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  return (
    <div className='sticky sticky-under-header'>
      <div className=' flex flex-col text-dial-stratos'>
        <div className={currentSlug === OVERVIEW_SLUG_NAME ? 'hover:bg-dial-slate-300' : undefined}>
          <div className={currentSlug === OVERVIEW_SLUG_NAME ? 'bg-dial-slate-500 text-white' : undefined}>
            <a href='#' onClick={(e) => navigateToPlay(e, OVERVIEW_SLUG_NAME)}>
              <div className='py-4 px-8'>
                {format('ui.playbook.overview')}
              </div>
            </a>
          </div>
        </div>
        {modules
          .map(module => module.moduleSlug)
          .map((moduleSlug, index) => (
            <div
              key={`module-${index}`}
              className={currentSlug === moduleSlug ? 'bg-dial-slate-500' : undefined}
            >
              <a href='#' onClick={(e) => navigateToPlay(e, moduleSlug)}>
                <div className={currentSlug === moduleSlug ? 'bg-dial-slate-500 text-white' : undefined}>
                  <div className='flex flex-col gap-y-1 py-3 px-8'>
                    {`${format('dpi.curriculum.module')} ${index + 1}. ${moduleNames[moduleSlug]}`}
                    {
                      currentSlug === moduleSlug &&
                      subModuleNames[moduleSlug] &&
                      subModuleNames[moduleSlug].map((moveName, index) =>
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
          ))}
      </div>
    </div>
  )
}

export default CurriculumNavigation
