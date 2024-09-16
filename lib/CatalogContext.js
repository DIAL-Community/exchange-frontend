import { FilterProvider } from '../components/context/FilterContext'
import { QueryParamContextProvider } from '../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../components/context/ResourceFilterContext'
import { SiteSettingProvider } from '../components/context/SiteSettingContext'

const CatalogContext = ({ children }) => {
  return (
    <QueryParamContextProvider>
      <ResourceFilterProvider>
        <FilterProvider>
          <SiteSettingProvider>
            {children}
          </SiteSettingProvider>
        </FilterProvider>
      </ResourceFilterProvider>
    </QueryParamContextProvider>
  )
}

export default CatalogContext
