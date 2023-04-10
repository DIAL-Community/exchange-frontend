import { BuildingBlockFilterProvider } from '../components/context/BuildingBlockFilterContext'
import { FilterContextProvider } from '../components/context/FilterContext'
import { MapFilterContextProvider } from '../components/context/MapFilterContext'
import { OrganizationFilterProvider } from '../components/context/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/ProductFilterContext'
import { DatasetFilterProvider } from '../components/context/DatasetFilterContext'
import { ProjectFilterProvider } from '../components/context/ProjectFilterContext'
import { SDGFilterProvider } from '../components/context/SDGFilterContext'
import { UseCaseFilterProvider } from '../components/context/UseCaseFilterContext'
import { WorkflowFilterProvider } from '../components/context/WorkflowFilterContext'
import { PlaybookFilterProvider } from '../components/context/PlaybookFilterContext'
import { PlayFilterProvider } from '../components/context/PlayFilterContext'
import { UserFilterProvider } from '../components/context/UserFilterContext'
import { QueryParamContextProvider } from '../components/context/QueryParamContext'
import { OpportunityFilterProvider } from '../components/context/OpportunityFilterContext'

const DigitalInvestmentFrameworkFilterContexts = ({ children }) => {
  return (
    <SDGFilterProvider>
      <UseCaseFilterProvider>
        <WorkflowFilterProvider>
          <BuildingBlockFilterProvider>
            <ProductFilterProvider>
              <DatasetFilterProvider>
                {children}
              </DatasetFilterProvider>
            </ProductFilterProvider>
          </BuildingBlockFilterProvider>
        </WorkflowFilterProvider>
      </UseCaseFilterProvider>
    </SDGFilterProvider>
  )
}

const PlaybookFilterContexts = ({ children }) => {
  return (
    <PlaybookFilterProvider>
      <PlayFilterProvider>
        {children}
      </PlayFilterProvider>
    </PlaybookFilterProvider>
  )
}

const CatalogContext = ({ children }) => {
  return (
    <FilterContextProvider>
      <DigitalInvestmentFrameworkFilterContexts>
        <ProjectFilterProvider>
          <OrganizationFilterProvider>
            <OpportunityFilterProvider>
              <PlaybookFilterContexts>
                <UserFilterProvider>
                  <MapFilterContextProvider>
                    <QueryParamContextProvider>
                      {children}
                    </QueryParamContextProvider>
                  </MapFilterContextProvider>
                </UserFilterProvider>
              </PlaybookFilterContexts>
            </OpportunityFilterProvider>
          </OrganizationFilterProvider>
        </ProjectFilterProvider>
      </DigitalInvestmentFrameworkFilterContexts>
    </FilterContextProvider>
  )
}

export default CatalogContext
