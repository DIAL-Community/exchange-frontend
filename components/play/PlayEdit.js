import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { PLAY_QUERY } from '../shared/query/play'
import PlayForm from './fragments/PlayForm'
import PlayEditLeft from './PlayEditLeft'

const PlayEdit = ({ playSlug, playbookSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug, playbookSlug, owner: 'public' },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { play, playbook } = data

  const slugNameMapping = (() => {
    const map = {}

    map[play?.slug] = play?.name
    map[playbook?.slug] = playbook?.name

    map.edit = format('app.edit')
    map.create = format('app.create')

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='hidden lg:block basis-1/3'>
          <PlayEditLeft play={play} />
        </div>
        <div className='lg:basis-2/3'>
          <PlayForm playbook={playbook} play={play} />
        </div>
      </div>
    </div>
  )
}

export default PlayEdit
