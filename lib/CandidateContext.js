import { OrganizationFilterProvider } from '../components/context/candidate/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/candidate/ProductFilterContext'
import { RoleFilterProvider } from '../components/context/candidate/RoleFilterContext'

const Context = ({ children }) => {
  return (
    <OrganizationFilterProvider>
      <ProductFilterProvider>
        <RoleFilterProvider>
          {children}
        </RoleFilterProvider>
      </ProductFilterProvider>
    </OrganizationFilterProvider>
  )
}

export default Context
