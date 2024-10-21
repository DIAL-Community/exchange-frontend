import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { SITE_SETTING_DETAIL_QUERY } from '../shared/query/siteSetting'
import SiteSettingDetailLeft from './SiteSettingDetailLeft'
import SiteSettingDetailRight from './SiteSettingDetailRight'

const SiteSettingDetail = ({ slug }) => {
  const scrollRef = useRef(null)

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
    const map = {}
    map[siteSetting.slug] = siteSetting.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <SiteSettingDetailLeft scrollRef={scrollRef} siteSetting={siteSetting} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <SiteSettingDetailRight ref={scrollRef} siteSetting={siteSetting} />
        </div>
      </div>
    </div>
  )
}

export default SiteSettingDetail
