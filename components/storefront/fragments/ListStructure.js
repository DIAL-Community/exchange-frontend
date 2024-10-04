import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_STOREFRONTS_QUERY } from '../../shared/query/organization'
import { DisplayType } from '../../utils/constants'
import StorefrontCard from '../StorefrontCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, buildingBlocks, countries, sectors, specialties, certifications } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_STOREFRONTS_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      specialties: specialties.map(specialty => specialty.value),
      certifications: certifications.map(certification => certification.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedStorefronts) {
    return <NotFound />
  }

  const { paginatedStorefronts: storefronts } = data

  return (
    <div className='flex flex-col gap-3'>
      {storefronts.map((storefront, index) =>
        <div key={index}>
          <StorefrontCard
            index={index}
            storefront={storefront}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
