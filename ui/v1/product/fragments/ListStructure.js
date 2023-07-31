import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_PRODUCTS_QUERY } from '../../shared/query/product'
import { ProductFilterContext } from '../../../../components/context/ProductFilterContext'
import ProductCard from '../ProductCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../../../components/context/FilterContext'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { setResultCounts } = useContext(FilterContext)
  const { search } = useContext(ProductFilterContext)

  const { isLinkedWithDpi } = useContext(ProductFilterContext)
  const { useCases, buildingBlocks, sectors, tags } = useContext(ProductFilterContext)
  const { licenseTypes, sdgs, origins, workflows } = useContext(ProductFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_PRODUCTS_QUERY, {
    variables: {
      search,
      useCases: useCases.map(useCase => useCase.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      licenseTypes: licenseTypes.map(licenseType => licenseType.value),
      sdgs: sdgs.map(sdg => sdg.number),
      workflows: workflows.map(workflow => workflow.id),
      origins: origins.map(origin => origin.value),
      isLinkedWithDpi,
      limit: defaultPageSize,
      offset: pageOffset
    },
    onCompleted: (data) => {
      setResultCounts(resultCount => {
        return { ...resultCount, 'filter.entity.products': data.paginatedProductsRedux.length }
      })
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedProductsRedux) {
    return <NotFound />
  }

  const { paginatedProductsRedux: products } = data

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
