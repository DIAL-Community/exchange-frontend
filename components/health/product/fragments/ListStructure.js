import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { FilterContext } from '../../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PAGINATED_PRODUCTS_QUERY } from '../../../shared/query/product'
import { DisplayType } from '../../../utils/constants'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'

const ListStructure = ({ pageOffset, defaultPageSize, onlyFeatured }) => {
  const {
    search,
    buildingBlocks,
    countries,
    licenseTypes,
    origins,
    productStage,
    sdgs,
    sectors,
    softwareCategories,
    softwareFeatures,
    tags,
    useCases,
    workflows
  } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_PRODUCTS_QUERY, {
    variables: {
      search,
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      countries: countries.map(country => country.value),
      licenseTypes: licenseTypes.map(licenseType => licenseType.value),
      origins: origins.map(origin => origin.value),
      sdgs: sdgs.map(sdg => sdg.value),
      sectors: sectors.map(sector => sector.value),
      softwareCategories: softwareCategories.map(category => category.value),
      softwareFeatures: softwareFeatures.map(feature => feature.value),
      tags: tags.map(tag => tag.label),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.id),
      limit: defaultPageSize,
      productStage,
      featured: onlyFeatured,
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

  return (
    <div className='px-4 lg:px-8 min-h-[70vh] py-8'>
      <ProductFilter />
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8'>
        {products.map((product, index) =>
          <ProductCard key={index} product={product} displayType={DisplayType.GRID_CARD} urlPrefix='/health' />
        )}
      </div>
    </div>
  )
}

export default ListStructure
