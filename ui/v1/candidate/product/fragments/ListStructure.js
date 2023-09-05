import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_CANDIDATE_PRODUCTS_QUERY } from '../../../shared/query/candidateProduct'
import ProductCard from '../ProductCard'
import { DisplayType } from '../../../utils/constants'
import { ProductFilterContext } from '../../../../../components/context/ProductFilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(ProductFilterContext)

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
