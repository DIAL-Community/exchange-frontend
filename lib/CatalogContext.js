import { BuildingBlockFilterProvider } from '../components/context/BuildingBlockFilterContext'
import { OrganizationFilterProvider } from '../components/context/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/ProductFilterContext'
import { ProjectFilterProvider } from '../components/context/ProjectFilterContext'
import { UseCaseFilterProvider } from '../components/context/UseCaseFilterContext'
import { WorkflowFilterProvider } from '../components/context/WorkflowFilterContext'

const CatalogContext = ({ children }) => {
  return (
    <UseCaseFilterProvider>
      <WorkflowFilterProvider>
        <BuildingBlockFilterProvider>
          <ProjectFilterProvider>
            <OrganizationFilterProvider>
              <ProductFilterProvider>
                {children}
              </ProductFilterProvider>
            </OrganizationFilterProvider>
          </ProjectFilterProvider>
        </BuildingBlockFilterProvider>
      </WorkflowFilterProvider>
    </UseCaseFilterProvider>
  )
}

export default CatalogContext
