import { OrganizationFilterProvider } from '../components/context/candidate/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/candidate/ProductFilterContext'
import { RoleFilterProvider } from '../components/context/candidate/RoleFilterContext'
import { DatasetFilterProvider } from '../components/context/candidate/DatasetFilterContext'

const Context = ({ children }) => {
  return (
    <OrganizationFilterProvider>
      <ProductFilterProvider>
        <DatasetFilterProvider>
          <RoleFilterProvider>
            {children}
          </RoleFilterProvider>
        </DatasetFilterProvider>
      </ProductFilterProvider>
    </OrganizationFilterProvider>
  )
}

export default Context
