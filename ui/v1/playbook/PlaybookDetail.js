import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { PLAYBOOK_DETAIL_QUERY } from '../shared/query/playbook'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import PlaybookDetailHeader from './fragments/PlaybookDetailHeader'
import PlaybookDetailLeft from './PlaybookDetailLeft'
import PlaybookDetailRight from './PlaybookDetailRight'

const PlaybookDetail = ({ slug, locale }) => {
  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const scrollRef = useRef(null)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { playbook } = data

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <PlaybookDetailHeader playbook={playbook} />
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <PlaybookDetailLeft playbook={playbook} scrollRef={scrollRef} />
        </div>
        <div className='basis-2/3'>
          <div className='px-4 py-4 lg:py-6'>
            <PlaybookDetailRight playbook={playbook} locale={locale} ref={scrollRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetail
