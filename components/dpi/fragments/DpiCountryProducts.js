import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductCard from '../../product/ProductCard'
import { DisplayType } from '../../utils/constants'
import DpiPagination from './DpiPagination'

const DEFAULT_PAGE_SIZE = 6

const DpiCountryProducts = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)
  const [displayedProducts, setDisplayedProducts] = useState([])

  useEffect(() => {
    setDisplayedProducts(
      country.dpiProducts.slice(
        0,
        DEFAULT_PAGE_SIZE
      )
    )
  }, [country])

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
    setDisplayedProducts(
      country.dpiProducts.slice(
        destinationPage * DEFAULT_PAGE_SIZE,
        (destinationPage + 1) * DEFAULT_PAGE_SIZE
      )
    )
  }, [country])

  return (
    <div className='product-section bg-dial-sapphire'>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='text-xl text-center py-8 text-dial-cotton'>
          {format('ui.product.header')}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
          {displayedProducts.map((product, index) =>
            <ProductCard key={index} product={product} displayType={DisplayType.DPI_CARD} />
          )}
        </div>
        <DpiPagination
          pageNumber={pageNumber}
          totalCount={country.dpiProducts.length}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
          theme='light'
        />
      </div>
    </div>
  )
}

export default DpiCountryProducts
