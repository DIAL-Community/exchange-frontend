import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { MOVE_QUERY } from '../shared/query/move'
import MoveForm from './fragments/MoveForm'
import MoveEditLeft from './MoveEditLeft'

const MoveEdit = ({ moveSlug, playSlug, playbookSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: { moveSlug, playSlug, playbookSlug, owner: 'public' },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { move, play, playbook } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.create'),
      create: format('app.create')
    }

    map[move?.slug] = move?.name
    map[play?.slug] = play?.name
    map[playbook?.slug] = playbook?.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <MoveEditLeft move={move} />
        </div>
        <div className='lg:basis-2/3'>
          <MoveForm playbook={playbook} play={play} move={move} />
        </div>
      </div>
    </div>
  )
}

export default MoveEdit
