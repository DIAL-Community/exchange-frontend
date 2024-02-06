import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_SYNCS_QUERY } from '../../shared/query/sync'
import { FilterContext } from '../../context/FilterContext'
import SyncCard from '../SyncCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_SYNCS_QUERY, {
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
  } else if (!data?.paginatedSyncs) {
    return <NotFound />
  }

  const { paginatedSyncs: syncs } = data

  return (
    <div className='flex flex-col gap-3'>
      {syncs.map((sync, index) =>
        <div key={index}>
          <SyncCard
            index={index}
            sync={sync}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
