import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PLAYS_QUERY } from '../../shared/query/play'
import { DraggableContext } from './DraggableContext'

export const SOURCE_TYPE_ASSIGNING = 'source.type.assign'
export const SOURCE_TYPE_LISTING = 'source.type.listing'

const PlayCard = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentPlays, setDirty, setCurrentPlays } = useContext(DraggableContext)

  const assignPlay = (play) => {
    setDirty(true)
    setCurrentPlays([...currentPlays, { id: play.id, slug: play.slug, name: play.name }])
  }

  return (
    <div className='bg-white border border-dial-gray text-dial-stratos border-opacity-50 shadow-md'>
      <div className='flex flex-row gap-4 px-3 py-4 h-16'>
        <div className={`font-semibold my-auto ${play.draft && 'text-dial-sapphire'}`}>
          {play.name}
          {play.draft &&
            <span className='font-bold px-1'>
              ({format('ui.play.status.draft')})
            </span>
          }
        </div>
        <div className='ml-auto my-auto text-sm'>
          <button
            type='button'
            className='bg-dial-sapphire text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50 shrink-0'
            onClick={() => assignPlay(play)}
          >
            {format('app.assign')}
          </button>
        </div>
      </div>
    </div>
  )
}

const ExistingPlayList = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { currentPlays } = useContext(DraggableContext)

  const { search } = useContext(FilterContext)
  const { loading, error, data } = useQuery(PLAYS_QUERY, {
    variables: { search, owner: 'public' },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
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

  const { plays: plays } = data
  const currentSlugs = currentPlays.map(play => play.slug)

  const displayPlays = () =>
    plays
      .filter(play => currentSlugs.indexOf(play.slug) < 0)
      .map((play, index) => <PlayCard key={index} play={play} />)

  const displayNoData = () =>
    <div className='text-sm font-medium opacity-80'>
      {format('noResults.entity', { entity: format('ui.play.label').toString().toLowerCase() })}
    </div>

  return (
    <div className='flex flex-col gap-2'>
      {plays.length > 0 ? displayPlays() : displayNoData()}
    </div>
  )
}

export default ExistingPlayList
