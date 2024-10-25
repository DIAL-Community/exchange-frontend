import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/product'
import ListStructure from '../product/fragments/ListStructure'

const HealthProducts = ({ onlyFeatured = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    search,
    buildingBlocks,
    countries,
    isLinkedWithDpi,
    licenseTypes,
    origins,
    productStage,
    sdgs,
    sectors,
    showDpgaOnly,
    showGovStackOnly,
    softwareCategories,
    softwareFeatures,
    tags,
    useCases,
    workflows
  } = useContext(FilterContext)

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query

  const DEFAULT_PAGE_SIZE = 24

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

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
      showGovStackOnly,
      showDpgaOnly,
      productStage,
      softwareCategories: softwareCategories.map(softwareCategory => softwareCategory.id),
      softwareFeatures: softwareFeatures.map(softwareFeature => softwareFeature.id),
      featured: onlyFeatured
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-48 min-h-[70vh] py-8'>
      { onlyFeatured &&
        <div className='text-3xl leading-tight font-bold py-3 pl-8 text-health-blue'>
          Featured Products
        </div>
      }
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        onlyFeatured={onlyFeatured}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeProduct.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </div>
  )
}

export default HealthProducts
