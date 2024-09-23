import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_SITE_SETTINGS_QUERY } from '../../shared/query/siteSetting'
import { DisplayType } from '../../utils/constants'
import SiteSettingCard from '../SiteSettingCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_SITE_SETTINGS_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedSiteSettings) {
    return <NotFound />
  }

  const { paginatedSiteSettings: siteSettings } = data

  return (
    <div className='flex flex-col gap-3'>
      {siteSettings.map((siteSetting, index) =>
        <div key={index}>
          <SiteSettingCard
            index={index}
            siteSetting={siteSetting}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
