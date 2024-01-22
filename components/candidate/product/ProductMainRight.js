import { useActiveTenant, useUser } from '../../../lib/hooks'
import RequireAuth from '../../shared/RequireAuth'
import ProductForm from './fragments/ProductForm'
import ProductListRight from './fragments/ProductListRight'

const ProductMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <ProductListRight />
      : <RequireAuth />
    : <ProductListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <ProductForm /> }
    </div>
  )
}

export default ProductMainRight
