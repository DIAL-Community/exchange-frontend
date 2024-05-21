import { useContext, useEffect, useRef } from 'react'
import { CurriculumContext } from './CurriculumContext'
import CurriculumHeader from './CurriculumHeader'
import CurriculumModules from './CurriculumModules'
import CurriculumNavigation from './CurriculumNavigation'

const CurriculumDetail = ({ curriculum }) => {

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
        ... curriculumModules.map(curriculumModule => {
          return ({
            moduleId: curriculumModule.id,
            moduleName: curriculumModule.playName,
            moduleSlug: curriculumModule.playSlug,
            moduleOrder: curriculumModule.playOrder
          })
        })].sort((a, b) => a.moduleOrder - b.moduleOrder))

      setModuleNames(previousModuleNames => {
        const currentModuleNames = { ...previousModuleNames }
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
  }, [curriculum, setModules, setModuleNames, setSubModuleNames])

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <CurriculumNavigation moduleRefs={moduleRefs} />
        </div>
        <div className='lg:basis-2/3'>
          <div className='px-4 lg:px-0 py-4 lg:py-6'>
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
