import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useActiveTenant } from '../../../../lib/hooks'
import { FilterContext } from '../../../context/FilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
import { PLAYS_QUERY } from '../../../shared/query/play'
import { DraggableContext } from './DraggableContext'

export const SOURCE_TYPE_ASSIGNING = 'source.type.assign'
export const SOURCE_TYPE_LISTING = 'source.type.listing'

const ModuleCard = ({ module }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentModules, setDirty, setCurrentModules } = useContext(DraggableContext)

  const assignModule = (module) => {
    setDirty(true)
    setCurrentModules([...currentModules, { id: module.id, slug: module.slug, name: module.name }])
  }

  return (
    <div className='bg-white border border-dial-gray text-dial-stratos border-opacity-50 shadow-md'>
      <div className='flex flex-row gap-4 px-3 py-4 h-16'>
        <div className='w-3/6 font-semibold my-auto whitespace-nowrap overflow-hidden text-ellipsis'>
          {module.name}
        </div>
        <div className='ml-auto my-auto text-sm'>
          <button
            type='button'
            className='bg-dial-sapphire text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
            onClick={() => assignModule(module)}
          >
            {format('app.assign')}
          </button>
        </div>
      </div>
    </div>
  )
}

const ExistingModuleList = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { currentModules } = useContext(DraggableContext)

  const { tenant } = useActiveTenant()

  const { search } = useContext(FilterContext)
  const { loading, error, data } = useQuery(PLAYS_QUERY, {
    variables: { search, owner: tenant },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.plays) {
    return <NotFound />
  }

  const { plays: modules } = data
  const currentSlugs = currentModules.map(play => play.slug)

  const displayModules = () =>
    modules
      .filter(module => currentSlugs.indexOf(module.slug) < 0)
      .map((module, index) => <ModuleCard key={index} module={module} />)

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('dpi.curriculum.module.label').toString().toLowerCase() })}
    </div>

  return (
    <div className='flex flex-col gap-2'>
      {modules.length > 0 ? displayModules() : displayNoData()}
    </div>
  )
}

export default ExistingModuleList
