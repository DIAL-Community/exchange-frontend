import { useContext } from 'react'
import { ProductFilterContext, ProductFilterDispatchContext } from '../context/ProductFilterContext'

const ProductFilter = (props) => {
  const openFilter = props.openFilter
  const { withMaturity, origins } = useContext(ProductFilterContext)
  const { setWithMaturity, setOrigins } = useContext(ProductFilterDispatchContext)

  const handleToggle = () => {
    setWithMaturity(!withMaturity)
  }

  return (
    <>
      <div className={openFilter ? 'block' : 'hidden'} id='link1'>
        <div className='px-2 pb-2 text-sm text-white'>
          <input
            type='checkbox'
            onChange={handleToggle}
            key='maturity-data-toggle'
            name='withMaturityData'
            checked={withMaturity}
          />
        </div>
      </div>
      <div className={openFilter ? 'hidden' : 'block'} id='link1'>
        <div className='px-2 pb-2 text-sm text-white'>
          Summary of filters goes here.
        </div>
      </div>
    </>
  )
}

export default ProductFilter
