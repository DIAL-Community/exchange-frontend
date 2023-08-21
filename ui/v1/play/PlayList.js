import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { PlayFilterContext } from '../../../components/context/PlayFilterContext'
import { DisplayType } from '../utils/constants'
import { PLAYS_QUERY } from '../shared/query/play'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { PlayListContext } from './context/PlayListContext'
import PlayCard from './PlayCard'

export const SOURCE_TYPE_ASSIGNING = 'source.type.assign'
export const SOURCE_TYPE_LISTING = 'source.type.listing'

const PlayListQuery = ({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { locale } = useRouter()
  const { currentPlays } = useContext(PlayListContext)

  const { search } = useContext(PlayFilterContext)
  const { loading, error, data } = useQuery(PLAYS_QUERY, {
    variables: { search, slug: playbook.slug },
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

  return (
    <>
      {plays.length > 0
        ? plays.map((play, index) => {
          return currentPlays.filter(e => e.id === play.id).length < 0 &&
            <PlayCard key={index} play={play} displayType={DisplayType.SMALL_CARD} />
        })
        : <div className='text-sm font-medium opacity-80'>
          {format('noResults.entity', { entity: format('ui.play.label').toString().toLowerCase() })}
        </div>
      }
    </>
  )
}

export default PlayListQuery
