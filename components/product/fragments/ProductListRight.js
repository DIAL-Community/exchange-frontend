import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ProductFilterContext } from '../../context/ProductFilterContext'
import { PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/product'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import ProductSearchBar from './ProductSearchBar'

const ProductListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, isLinkedWithDpi, showGovStackOnly } = useContext(ProductFilterContext)
  const { useCases, buildingBlocks, sectors, tags } = useContext(ProductFilterContext)
  const { countries, licenseTypes, sdgs, origins, workflows } = useContext(ProductFilterContext)

  const [ pageNumber, setPageNumber ] = useState(0)
  const [ pageOffset, setPageOffset ] = useState(0)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
    // Scroll to top of the page
    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(PRODUCT_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      useCases: useCases.map(useCase => useCase.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      sectors: sectors.map(sector => sector.value),
      countries: countries.map(country => country.value),
      tags: tags.map(tag => tag.label),
      licenseTypes: licenseTypes.map(licenseType => licenseType.value),
      sdgs: sdgs.map(sdg => sdg.value),
      workflows: workflows.map(workflow => workflow.id),
      origins: origins.map(origin => origin.value),
      isLinkedWithDpi,
      showGovStackOnly
    }
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
          totalCount={data.paginationAttributeProduct.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default ProductListRight
