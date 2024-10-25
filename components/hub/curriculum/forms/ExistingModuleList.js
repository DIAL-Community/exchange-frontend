import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { FilterContext } from '../../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PLAYS_QUERY } from '../../../shared/query/play'
import { DPI_TENANT_NAME } from '../../constants'
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
        <div className={`font-semibold my-auto ${module.draft && 'text-dial-sapphire'}`}>
          {module.name}
          {module.draft &&
            <span className='font-bold px-1'>
              ({format('ui.play.status.draft')})
            </span>
          }
        </div>
        <div className='ml-auto my-auto text-sm'>
          <button
            type='button'
            className='bg-dial-sapphire text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50 shrink-0'
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

  const { search } = useContext(FilterContext)
  const { loading, error, data } = useQuery(PLAYS_QUERY, {
    variables: { search, owner: DPI_TENANT_NAME },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.plays) {
    return handleMissingData()
  }

  const { plays: modules } = data
  const currentSlugs = currentModules.map(play => play.slug)

  const displayModules = () =>
    modules
      .filter(module => currentSlugs.indexOf(module.slug) < 0)
      .map((module, index) => <ModuleCard key={index} module={module} />)

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('hub.curriculum.module.label').toString().toLowerCase() })}
    </div>

  return (
    <div className='flex flex-col gap-2'>
      {modules.length > 0 ? displayModules() : displayNoData()}
    </div>
  )
}

export default ExistingModuleList
