import { useCallback, useContext, useEffect } from 'react'
import { MdPlayArrow } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { isDebugLoggingEnabled } from '../../utils/utilities'
import { CurriculumContext } from './CurriculumContext'

const CurriculumSideNavigation = ({ moduleRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    currentSlug,
    setCurrentSlug,
    modules,
    moduleNames,
    subModuleNames,
    modulePercentages,
    directAccess,
    setDirectAccess
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
    const findModuleWithHighestPercentage = () => {
      let currentMaxIndex = 0
      let { moduleSlug: currentMaxModuleSlug } = modules[currentMaxIndex]
      let currentMaxPercentage = modulePercentages[currentMaxModuleSlug]

      for (let i = 1; i < modules.length; i++) {
        let { moduleSlug: currentMaxModuleSlug } = modules[i]
        if (modulePercentages[currentMaxModuleSlug] >= currentMaxPercentage) {
          currentMaxIndex = i
          currentMaxPercentage = modulePercentages[currentMaxModuleSlug]
        }
      }

      return modules[currentMaxIndex]
    }

    const eventHandler = (event) => {
      if (isDebugLoggingEnabled()) {
        console.log('Scroll event triggered. Event data: ', event)
      }

      if (directAccess) {
        setDirectAccess(false)
      } else {
        const { moduleSlug } = findModuleWithHighestPercentage()
        setCurrentSlug(moduleSlug)
        setDirectAccess(false)
      }
    }

    document.addEventListener('scrollend', eventHandler)

    return () => {
      document.removeEventListener('scrollend', eventHandler)
    }
  }, [directAccess, setDirectAccess, modules, modulePercentages, setCurrentSlug])

  return (
    <div className='sticky' style={{ top: 'calc(var(--header-height) + var(--filter-height) + 1.5rem)' }}>
      <div className=' flex flex-col text-dial-stratos'>
        {modules
          .map(module => module.moduleSlug)
          .map((moduleSlug, index) => (
            <div
              key={`module-${index}`}
              className={currentSlug === moduleSlug ? 'bg-dial-slate-500' : undefined}
            >
              <a
                href={`/navigate-to-${moduleSlug}`}
                onClick={(e) => navigateToPlay(e, moduleSlug)}
              >
                <div className={currentSlug === moduleSlug ? 'bg-dial-slate-500 text-dial-cotton' : undefined}>
                  <div className='flex flex-col gap-y-1 py-3 px-4 lg:px-8'>
                    {index <= 0
                      ? moduleNames[moduleSlug]
                      : `${format('hub.curriculum.module.label')} ${index}. ${moduleNames[moduleSlug]}`
                    }
                    {
                      currentSlug === moduleSlug &&
                      subModuleNames[moduleSlug] &&
                      subModuleNames[moduleSlug].map((subModuleName, index) =>
                        <div key={`curriculum-module-submodule-${index}`} className='flex gap-x-2'>
                          <MdPlayArrow size='0.8rem' className='my-auto' />
                          {subModuleName}
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

export default CurriculumSideNavigation
