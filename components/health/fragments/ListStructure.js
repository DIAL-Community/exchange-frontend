import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { ProductFilterContext } from '../../context/ProductFilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_PRODUCTS_QUERY } from '../../shared/query/product'
import { DisplayType } from '../../utils/constants'
import ProductCard from '../../product/ProductCard'
import ProductFilter from './ProductFilter'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(ProductFilterContext)

  const { isLinkedWithDpi, showGovStackOnly, showDpgaOnly } = useContext(ProductFilterContext)
  const { useCases, buildingBlocks, sectors, tags } = useContext(ProductFilterContext)
  const { countries, licenseTypes, sdgs, origins, workflows } = useContext(ProductFilterContext)

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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedProducts) {
    return <NotFound />
  }

  const { paginatedProducts: products } = data

  return (
    <div className='px-4 lg:px-8 min-h-[70vh] py-8'>
      <ProductFilter />
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8'>
        {products.map((product, index) =>
          <ProductCard key={index} product={product} displayType={DisplayType.GRID_CARD}  />
        )}
      </div>
    </div>
  )
}

export default ListStructure
