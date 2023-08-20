import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { ObjectType } from '../../../lib/constants'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'
import CommentsSection from '../shared/comment/CommentsSection'
import { Error, Loading, NotFound, Unauthorized } from '../shared/FetchStatus'
import PlaybookDetailHeader from './fragments/PlaybookDetailHeader'
import PlaybookDetailNavigation from './fragments/PlaybookDetailNavigation'
import PlaybookDetailOverview from './fragments/PlaybookDetailOverview'
import PlaybookDetailPlayList from './fragments/PlaybookDetailPlayList'

const PlaybookDetail = ({ slug, locale }) => {
  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const commentsSectionElement = useRef(null)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const PlaybookDetail = () => (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <PlaybookDetailHeader playbook={data?.playbook} />
      <div className='flex gap-x-3'>
        <div className='hidden lg:block basis-1/3'>
          <PlaybookDetailNavigation playbook={data?.playbook} />
        </div>
        <div className='flex flex-col gap-3 basis-2/3'>
          <PlaybookDetailOverview
            playbook={data?.playbook}
            locale={locale}
            allowEmbedCreation
            commentsSectionRef={commentsSectionElement}
          />
          <PlaybookDetailPlayList slug={slug} locale={locale} />
          <CommentsSection
            commentsSectionRef={commentsSectionElement}
            objectId={data?.playbook.id}
            objectType={ObjectType.PLAYBOOK}
            className='pt-20'
          />
        </div>
      </div>
    </div>
  )

  return data?.playbook ? <PlaybookDetail /> : <Unauthorized />
}

export default PlaybookDetail
