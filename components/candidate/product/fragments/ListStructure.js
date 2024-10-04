import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../../context/FilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
import { PAGINATED_CANDIDATE_PRODUCTS_QUERY } from '../../../shared/query/candidateProduct'
import { DisplayType } from '../../../utils/constants'
import ProductCard from '../ProductCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_PRODUCTS_QUERY, {
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
  } else if (!data?.paginatedCandidateProducts) {
    return <NotFound />
  }

  const { paginatedCandidateProducts: products } = data

  return (
    <div className='flex flex-col gap-3'>
      {products.map((product, index) =>
        <div key={index}>
          <ProductCard
            index={index}
            product={product}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
