import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_PRODUCTS_QUERY } from '../../shared/query/product'
import { DisplayType, MainDisplayType } from '../../utils/constants'
import ProductCard from '../ProductCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const {
    search,
    displayType,
    buildingBlocks,
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

  const { loading, error, data } = useQuery(PAGINATED_PRODUCTS_QUERY, {
    variables: {
      search,
      useCases: useCases.map(useCase => useCase.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      countries: countries.map(country => country.value),
      licenseTypes: licenseTypes.map(licenseType => licenseType.value),
      sdgs: sdgs.map(sdg => sdg.value),
      workflows: workflows.map(workflow => workflow.id),
      origins: origins.map(origin => origin.value),
      isLinkedWithDpi,
      showGovStackOnly,
      showDpgaOnly,
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
  } else if (!data?.paginatedProducts) {
    return handleMissingData()
  }

  const { paginatedProducts: products } = data

  const gridDisplay = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {products.map((product, index) =>
        <ProductCard
          key={index}
          index={index}
          product={product}
          displayType={DisplayType.GRID_CARD}
        />
      )}
    </div>
  )

  const listDisplay = () => (
    <div className='flex flex-col gap-3'>
      {products.map((product, index) =>
        <ProductCard
          key={index}
          index={index}
          product={product}
          displayType={DisplayType.LARGE_CARD}
        />
      )}
    </div>
  )

  return displayType === MainDisplayType.GRID ? gridDisplay() : listDisplay()
}

export default ListStructure
