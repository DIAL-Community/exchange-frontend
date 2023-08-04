import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { SDG_DETAIL_QUERY } from '../shared/query/sdg'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import SdgForm from './fragments/SdgForm'
import SdgEditLeft from './SdgEditLeft'

const SdgEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(SDG_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sdg) {
    return <NotFound />
  }

  const { sdg } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[sdg.slug] = data.sdg.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='lg:basis-1/3'>
          <SdgEditLeft sdg={sdg} />
        </div>
        <div className='lg:basis-2/3'>
          <SdgForm sdg={sdg} />
        </div>
      </div>
    </div>
  )
}

export default SdgEdit
