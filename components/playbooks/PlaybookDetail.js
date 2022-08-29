import { useQuery } from '@apollo/client'
import CommentsSection from '../shared/CommentsSection'
import { PLAYBOOK_QUERY } from '../../queries/playbook'
import { ObjectType } from '../../lib/constants'
import { Error, Loading } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import PlaybookDetailOverview from './PlaybookDetailOverview'
import PlaybookDetailNavigation from './PlaybookDetailNavigation'
import PlaybookDetailHeader from './PlaybookDetailHeader'
import PlaybookDetailPlayList from './PlaybookDetailPlayList'

const PlaybookDetail = ({ slug, locale }) => {
  const { data, loading, error } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <div className='sticky sticky-under-header flex flex-col max-w-catalog mx-auto'>
      <PlaybookDetailHeader playbook={data?.playbook} />
      <div className='flex gap-x-3'>
        <div className='hidden lg:block w-1/4'>
          <PlaybookDetailNavigation playbook={data?.playbook} />
        </div>
        <div className='flex flex-col gap-3 w-full max-w-screen-lg'>
          <PlaybookDetailOverview playbook={data?.playbook} locale={locale} allowEmbedCreation />
          <PlaybookDetailPlayList slug={slug} locale={locale} />
          <div className='px-2'>
            <CommentsSection objectId={data?.playbook?.id} objectType={ObjectType.PLAYBOOK} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetail
