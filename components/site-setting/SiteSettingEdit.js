import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { SITE_SETTING_DETAIL_QUERY } from '../shared/query/siteSetting'
import SiteSettingForm from './fragments/SiteSettingForm'
import SiteSettingEditLeft from './SiteSettingEditLeft'

const SiteSettingEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.siteSetting) {
    return <NotFound />
  }

  const { siteSetting } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[siteSetting.slug] = siteSetting.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <SiteSettingEditLeft siteSetting={siteSetting} />
        </div>
        <div className='lg:basis-2/3'>
          <SiteSettingForm siteSetting={siteSetting} />
        </div>
      </div>
    </div>
  )
}

export default SiteSettingEdit
