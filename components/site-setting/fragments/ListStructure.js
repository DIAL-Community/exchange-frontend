import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
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
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedSiteSettings) {
    return handleMissingData()
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
