import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { FilterContext } from '../../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PAGINATED_CANDIDATE_PRODUCTS_QUERY } from '../../../shared/query/candidateProduct'
import { DisplayType } from '../../../utils/constants'
import ProductCard from '../ProductCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, currentUserOnly } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_PRODUCTS_QUERY, {
    variables: {
      search,
      currentUserOnly,
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
  } else if (!data?.paginatedCandidateProducts) {
    return handleMissingData()
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
