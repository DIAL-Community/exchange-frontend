import { FilterProvider } from '../components/context/FilterContext'
import { QueryParamContextProvider } from '../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../components/context/ResourceFilterContext'
import { SiteSettingProvider } from '../components/context/SiteSettingContext'

const CatalogContext = ({ children }) => {
  return (
    <QueryParamContextProvider>
      <ResourceFilterProvider>
        <SiteSettingProvider>
          <FilterProvider>
            {children}
          </FilterProvider>
        </SiteSettingProvider>
      </ResourceFilterProvider>
    </QueryParamContextProvider>
  )
}

export default CatalogContext
