import { useContext } from 'react'
import classNames from 'classnames'
import { FilterContext } from '../context/FilterContext'
import { MainDisplayType } from '../utils/constants'
import ProductMainLeft from './ProductMainLeft'
import ProductMainRight from './ProductMainRight'

const ProductMain = ({ activeTab }) => {
  const { displayType, displayFilter } = useContext(FilterContext)

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='flex gap-x-8'>
        <div
          className={classNames(
            'hidden md:block basis-1/3 shrink-0',
            'transition-[flex-basis] duration-700 ease-in-out overflow-hidden',
            displayType === MainDisplayType.GRID && activeTab === 0
              ? 'shrink-0'
              : 'basis-1/3 shrink-0',
            displayFilter ? 'basis-1/3 shrink-0' : 'basis-8 shrink-0'
          )}
        >
          <ProductMainLeft activeTab={activeTab} />
        </div>
        <div className='flex-grow'>
          <ProductMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default ProductMain
