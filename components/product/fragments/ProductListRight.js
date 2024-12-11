import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionPageSize, FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/product'
import ListStructure from './ListStructure'
import ProductSearchBar from './ProductSearchBar'

const ProductListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    search,
    buildingBlocks,
    collectionDisplayType,
    countries,
    isLinkedWithDpi,
    licenseTypes,
    origins,
    sdgs,
    sectors,
    showDpgaOnly,
    showGovStackOnly,
    tags,
    useCases,
    workflows
  } = useContext(FilterContext)

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * CollectionPageSize[collectionDisplayType])
    }
  }, [page, collectionDisplayType, setPageNumber, setPageOffset])

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage === 'undefined' ? selected : nextSelectedPage
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
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      countries: countries.map(country => country.value),
      isLinkedWithDpi,
      licenseTypes: licenseTypes.map(licenseType => licenseType.value),
      origins: origins.map(origin => origin.value),
      sdgs: sdgs.map(sdg => sdg.value),
      sectors: sectors.map(sector => sector.value),
      showDpgaOnly,
      showGovStackOnly,
      tags: tags.map(tag => tag.label),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.id)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <ProductSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        pageSize={CollectionPageSize[collectionDisplayType]}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeProduct.totalCount}
          defaultPageSize={CollectionPageSize[collectionDisplayType]}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default ProductListRight
