import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductCard from '../../product/ProductCard'
import { DisplayType } from '../../utils/constants'
import HubPagination from './HubPagination'

const DEFAULT_PAGE_SIZE = 6

const HubCountryProducts = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)
  const [displayedProducts, setDisplayedProducts] = useState(country.dpiProducts.slice(0, DEFAULT_PAGE_SIZE))

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
      <div className='px-4 lg:px-8 xl:px-56 flex flex-col'>
        <div className='text-xl font-medium text-center py-6 text-dial-cotton'>
          {format('ui.product.header')}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
          {displayedProducts.map((product, index) =>
            <ProductCard key={index} product={product} displayType={DisplayType.HUB_CARD} />
          )}
        </div>
        <HubPagination
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

export default HubCountryProducts
