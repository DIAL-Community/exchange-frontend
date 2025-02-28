import { useCallback, useContext, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
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

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const DEFAULT_PAGE_SIZE = 24

  const { page } = query
  const pageNumber = page ? parseInt(page) - 1 : 0
  const pageOffset = pageNumber * DEFAULT_PAGE_SIZE

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
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-48 min-h-[70vh] py-8'>
      { onlyFeatured &&
        <div className='text-3xl leading-tight font-bold py-3 pl-8 text-health-blue flex flex-row justify-between'>
          Featured Products
          <div className='inline text-lg flex pr-8 lg:pr-16'>
            <Link href='/health/products'>See all solutions</Link>
          </div>
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
