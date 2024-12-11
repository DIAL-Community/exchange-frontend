import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionDisplayType, FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_PRODUCTS_QUERY } from '../../shared/query/product'
import { DisplayType } from '../../utils/constants'
import ProductCard from '../ProductCard'

const ListStructure = ({ pageOffset, pageSize }) => {
  const {
    search,
    buildingBlocks,
    countries,
    collectionDisplayType,
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
      workflows: workflows.map(workflow => workflow.id),
      limit: pageSize,
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

  const listDisplay = (products) => (
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

  const gridDisplay = (products) => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
      {products.map((product, index) =>
        <div key={index}>
          <ProductCard
            index={index}
            product={product}
            displayType={DisplayType.GRID_CARD}
          />
        </div>
      )}
    </div>
  )

  const { paginatedProducts: products } = data

  return  collectionDisplayType === CollectionDisplayType.LIST
    ? listDisplay(products)
    : gridDisplay(products)
}

export default ListStructure
