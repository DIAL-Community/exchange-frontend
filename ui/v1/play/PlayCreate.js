import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { PLAY_QUERY } from '../shared/query/play'
import PlayForm from './fragments/PlayForm'
import PlaySimpleLeft from './fragments/PlaySimpleLeft'

const PlayCreate = ({ playbookSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playSlug: '', playbookSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { playbook } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.create'),
      create: format('app.create')
    }

    map[playbook?.slug] = playbook?.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <PlaySimpleLeft />
        </div>
        <div className='lg:basis-2/3'>
          <PlayForm playbook={playbook} />
        </div>
      </div>
    </div>
  )
}

export default PlayCreate
