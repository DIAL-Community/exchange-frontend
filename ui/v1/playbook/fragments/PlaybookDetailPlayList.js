import { useQuery } from '@apollo/client'
import { PLAYS_QUERY } from '../../shared/query/play'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import PlayDetailRight from '../../play/PlayDetailRight'

const PlaybookDetailPlayList = ({ locale, playbook }) => {
  const { loading, error, data } = useQuery(PLAYS_QUERY, {
    variables: {
      playbookSlug: playbook.slug
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  // Loading and error handler section.
  if (loading) {
    return <Loading />
  } else if (error) {
    if (error.networkError) {
      return <Error />
    } else {
      return <NotFound />
    }
  }

  const { plays } = data

  return (
    <div className='flex flex-col gap-y-6'>
      {plays.map((play, i) =>
        <PlayDetailRight key={i} playbook={playbook} play={play} index={i} />
      )}
    </div>
  )
}

export default PlaybookDetailPlayList
