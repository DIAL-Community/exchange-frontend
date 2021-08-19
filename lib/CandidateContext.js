import { OrganizationFilterProvider } from '../components/context/candidate/OrganizationFilterContext'
import { ProductFilterProvider } from '../components/context/candidate/ProductFilterContext'

const Context = ({ children }) => {
  return (
    <OrganizationFilterProvider>
      <ProductFilterProvider>
        {children}
      </ProductFilterProvider>
    </OrganizationFilterProvider>
  )
}

export default Context
