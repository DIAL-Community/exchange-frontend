import { BuildingBlockFilterProvider } from '../components/context/BuildingBlockFilterContext'
import { FilterResultContextProvider } from '../components/context/FilterResultContext'
import { MapFilterContextProvider } from '../components/context/MapFilterContext'
import { OrganizationFilterProvider } from '../components/context/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/ProductFilterContext'
import { ProjectFilterProvider } from '../components/context/ProjectFilterContext'
import { SDGFilterProvider } from '../components/context/SDGFilterContext'
import { UseCaseFilterProvider } from '../components/context/UseCaseFilterContext'
import { WorkflowFilterProvider } from '../components/context/WorkflowFilterContext'

const CatalogContext = ({ children }) => {
  return (
    <SDGFilterProvider>
      <UseCaseFilterProvider>
        <WorkflowFilterProvider>
          <BuildingBlockFilterProvider>
            <ProjectFilterProvider>
              <OrganizationFilterProvider>
                <ProductFilterProvider>
                  <FilterResultContextProvider>
                    <MapFilterContextProvider>
                      {children}
                    </MapFilterContextProvider>
                  </FilterResultContextProvider>
                </ProductFilterProvider>
              </OrganizationFilterProvider>
            </ProjectFilterProvider>
          </BuildingBlockFilterProvider>
        </WorkflowFilterProvider>
      </UseCaseFilterProvider>
    </SDGFilterProvider>
  )
}

export default CatalogContext
