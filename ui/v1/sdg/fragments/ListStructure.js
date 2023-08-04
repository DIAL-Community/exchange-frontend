import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_SDGS_QUERY } from '../../shared/query/sdg'
import { SdgFilterContext } from '../../../../components/context/SdgFilterContext'
import SdgCard from '../SdgCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../../../components/context/FilterContext'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { setResultCounts } = useContext(FilterContext)
  const { search } = useContext(SdgFilterContext)

  const { sectors } = useContext(SdgFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_SDGS_QUERY, {
    variables: {
      search,
      sectors: sectors.map(sector => sector.value),
      limit: defaultPageSize,
      offset: pageOffset
    },
    onCompleted: (data) => {
      setResultCounts(resultCount => {
        return { ...resultCount, 'filter.entity.sdgs': data.paginatedSdgs.length }
      })
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedSdgs) {
    return <NotFound />
  }

  const { paginatedSdgs: sdgs } = data

  return (
    <div className='flex flex-col gap-3'>
      {sdgs.map((sdg, index) =>
        <div key={index}>
          <SdgCard
            index={index}
            sdg={sdg}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
