import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useActiveTenant } from '../../lib/hooks'
import { PlayFilterContext } from '../context/PlayFilterContext'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
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

  const { tenant } = useActiveTenant()

  const { search } = useContext(PlayFilterContext)
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
