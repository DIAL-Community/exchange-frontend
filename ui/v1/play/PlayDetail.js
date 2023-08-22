import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { PLAY_QUERY } from '../shared/query/play'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import Breadcrumb from '../shared/Breadcrumb'
import PlayDetailRight from './PlayDetailRight'
import PlayDetailLeft from './PlayDetailLeft'

const PlayDetail = ({ playSlug, playbookSlug, locale }) => {
  const { data, loading, error } = useQuery(PLAY_QUERY, {
    variables: { playSlug, playbookSlug  },
    context: { headers: { 'Accept-Language': locale } }
  })

  const scrollRef = useRef(null)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.play) {
    return <NotFound />
  }

  const { play, playbook } = data

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name
    map[playbook.slug] = playbook.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <PlayDetailLeft play={play} scrollRef={scrollRef} />
        </div>
        <div className='basis-2/3'>
          <div className='px-4 py-4 lg:py-6'>
            <PlayDetailRight playbook={playbook} play={play} ref={scrollRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayDetail
