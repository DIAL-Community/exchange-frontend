import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useRef } from 'react'
import { ProductFilterContext } from '../../../context/ProductFilterContext'
import { CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../../shared/query/candidateProduct'
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants'
import Pagination from '../../../shared/Pagination'
import ListStructure from './ListStructure'
import ProductSearchBar from './ProductSearchBar'

const ProductListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(ProductFilterContext)

  const { pageNumber, pageOffset } = useContext(ProductFilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = nextSelectedPage ? nextSelectedPage : selected
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
  }

  const { loading, error, data } = useQuery(CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY, {
    variables: { search }
  })

  return (
    <>
      <ProductSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeCandidateProduct.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default ProductListRight
