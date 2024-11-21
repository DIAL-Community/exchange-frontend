import { useCallback, useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { CurriculumContext, OVERVIEW_SLUG_VALUE } from './CurriculumContext'
import CurriculumHeader from './CurriculumHeader'
import CurriculumModules from './CurriculumModules'
import CurriculumSideNavigation from './CurriculumSideNavigation'
import CurriculumTopNavigation from './CurriculumTopNavigation'

const CurriculumDetail = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const moduleRefs = useRef({})

  const {
    setModules,
    setModuleNames,
    setSubModuleNames
  } = useContext(CurriculumContext)

  useEffect(() => {
    const { plays: modules, playbookPlays: curriculumModules } = curriculum
    if (modules) {
      setModules([
        {
          moduleId: 0,
          moduleName: format('hub.curriculum.overview'),
          moduleSlug: OVERVIEW_SLUG_VALUE,
          moduleOrder: 0
        },
        ... curriculumModules
          .map(curriculumModule => ({
            moduleId: curriculumModule.id,
            moduleName: curriculumModule.playName,
            moduleSlug: curriculumModule.playSlug,
            moduleOrder: curriculumModule.playOrder + 1
          }))
          .sort((a, b) => a.moduleOrder - b.moduleOrder)
      ])

      setModuleNames(previousModuleNames => {
        const currentModuleNames = { ...previousModuleNames }
        currentModuleNames[OVERVIEW_SLUG_VALUE] = format('hub.curriculum.overview')
        modules.forEach(module => {
          currentModuleNames[module.slug] = module.name
        })

        return currentModuleNames
      })

      setSubModuleNames(previousSubModuleNames => {
        const currentSubModuleNames = { ...previousSubModuleNames }
        modules.forEach(module => {
          const { playMoves: subModules } = module
          const submoduleNames = subModules.map(subModule => subModule.name)
          currentSubModuleNames[module.slug] = submoduleNames
        })

        return currentSubModuleNames
      })
    }
  }, [format, curriculum, setModules, setModuleNames, setSubModuleNames])

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col min-h-[80vh]'>
      <CurriculumTopNavigation curriculum={curriculum} moduleRefs={moduleRefs} />
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <CurriculumSideNavigation curriculum={curriculum} moduleRefs={moduleRefs} />
        </div>
        <div className='lg:basis-2/3'>
          <div className='px-4 lg:px-0 py-4'>
            <div className='flex flex-col gap-y-3'>
              <CurriculumHeader curriculum={curriculum} moduleRefs={moduleRefs} />
              <CurriculumModules curriculum={curriculum} moduleRefs={moduleRefs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurriculumDetail
