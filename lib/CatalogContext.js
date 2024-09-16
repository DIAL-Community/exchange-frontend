import { FilterProvider } from '../components/context/FilterContext'
import { QueryParamContextProvider } from '../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../components/context/ResourceFilterContext'

const CatalogContext = ({ children }) => {
  return (
    <FilterProvider>
      <ResourceFilterProvider>
        <QueryParamContextProvider>
          {children}
        </QueryParamContextProvider>
      </ResourceFilterProvider>
    </FilterProvider>
  )
}

export default CatalogContext
