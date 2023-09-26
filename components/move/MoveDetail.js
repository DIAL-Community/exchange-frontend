import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { MOVE_QUERY } from '../shared/query/move'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import Breadcrumb from '../shared/Breadcrumb'
import MoveDetailLeft from './MoveDetailLeft'
import MoveDetailRight from './MoveDetailRight'

const MoveDetail = ({ moveSlug, playSlug, playbookSlug, locale }) => {
  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: {
      moveSlug,
      playSlug,
      playbookSlug
    },
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

  const { move, play, playbook } = data

  const slugNameMapping = (() => {
    const map = {}
    map[move.slug] = move.name
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
          <MoveDetailLeft move={move} scrollRef={scrollRef} />
        </div>
        <div className='basis-2/3 pb-8'>
          <MoveDetailRight playbook={playbook} play={play} move={move} ref={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default MoveDetail
