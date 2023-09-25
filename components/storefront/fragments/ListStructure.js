import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_STOREFRONTS_QUERY } from '../../shared/query/organization'
import { OrganizationFilterContext } from '../../../../components/context/OrganizationFilterContext'
import StorefrontCard from '../StorefrontCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(OrganizationFilterContext)

  const { buildingBlocks, sectors, countries, specialties, certifications } = useContext(OrganizationFilterContext)

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
