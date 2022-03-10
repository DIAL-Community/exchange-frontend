import { BuildingBlockFilterProvider } from '../components/context/BuildingBlockFilterContext'
import { DiscourseProvider } from '../components/context/DiscourseContext'
import { FilterContextProvider } from '../components/context/FilterContext'
import { MapFilterContextProvider } from '../components/context/MapFilterContext'
import { OrganizationFilterProvider } from '../components/context/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/ProductFilterContext'
import { ProjectFilterProvider } from '../components/context/ProjectFilterContext'
import { SDGFilterProvider } from '../components/context/SDGFilterContext'
import { UseCaseFilterProvider } from '../components/context/UseCaseFilterContext'
import { WorkflowFilterProvider } from '../components/context/WorkflowFilterContext'
import { PlaybookFilterProvider } from '../components/context/PlaybookFilterContext'
import { PlayFilterProvider } from '../components/context/PlayFilterContext'
import { UserFilterProvider } from '../components/context/UserFilterContext'
import { QueryParamContextProvider } from '../components/context/QueryParamContext'

const CatalogContext = ({ children }) => {
  return (
    <FilterContextProvider>
      <SDGFilterProvider>
        <UseCaseFilterProvider>
          <WorkflowFilterProvider>
            <BuildingBlockFilterProvider>
              <ProjectFilterProvider>
                <OrganizationFilterProvider>
                  <ProductFilterProvider>
                    <PlaybookFilterProvider>
                      <PlayFilterProvider>
                        <UserFilterProvider>
                          <MapFilterContextProvider>
                            <DiscourseProvider>
                              <QueryParamContextProvider>
                                {children}
                              </QueryParamContextProvider>
                            </DiscourseProvider>
                          </MapFilterContextProvider>
                        </UserFilterProvider>
                      </PlayFilterProvider>
                    </PlaybookFilterProvider>
                  </ProductFilterProvider>
                </OrganizationFilterProvider>
              </ProjectFilterProvider>
            </BuildingBlockFilterProvider>
          </WorkflowFilterProvider>
        </UseCaseFilterProvider>
      </SDGFilterProvider>
    </FilterContextProvider>
  )
}

export default CatalogContext
