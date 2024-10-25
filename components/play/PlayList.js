import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { FilterContext } from '../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { PLAYS_QUERY } from '../shared/query/play'
import { DisplayType } from '../utils/constants'
import { PlayListContext } from './context/PlayListContext'
import PlayCard from './PlayCard'

export const SOURCE_TYPE_ASSIGNING = 'source.type.assign'
export const SOURCE_TYPE_LISTING = 'source.type.listing'

const PlayListQuery = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { currentPlays } = useContext(PlayListContext)

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

  const { plays } = data
  const currentSlugs = currentPlays.map(play => play.slug)

  return (
    <>
      {plays.length > 0
        ? plays
          .filter(play => currentSlugs.indexOf(play.slug) < 0)
          .map((play, index) => <PlayCard key={index} play={play} displayType={DisplayType.SMALL_CARD} />)
        : <div className='text-sm font-medium opacity-80'>
          {format('noResults.entity', { entity: format('ui.play.label').toString().toLowerCase() })}
        </div>
      }
    </>
  )
}

export default PlayListQuery
