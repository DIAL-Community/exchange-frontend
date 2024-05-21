import { useContext, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { CurriculumContext } from './CurriculumContext'
import CurriculumHeader from './CurriculumHeader'
import CurriculumModules from './CurriculumModules'
import CurriculumNavigation from './CurriculumNavigation'

const CurriculumDetail = ({ slug, locale }) => {

  const moduleRefs = useRef({})

  const {
    setModules,
    setModuleNames,
    setSubModuleNames
  } = useContext(CurriculumContext)

  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    onCompleted: (data) => {
      const { playbook: { plays: modules, playbookPlays: curriculumModules } } = data
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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { playbook: curriculum } = data

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
