import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { REGION_DETAIL_QUERY } from '../shared/query/region'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import RegionForm from './fragments/RegionForm'
import RegionEditLeft from './RegionEditLeft'

const RegionEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(REGION_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.region) {
    return <NotFound />
  }

  const { region } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[region.slug] = region.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <RegionEditLeft region={region} />
        </div>
        <div className='lg:basis-2/3'>
          <RegionForm region={region} />
        </div>
      </div>
    </div>
  )
}

export default RegionEdit
