import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import ProductRibbon from '../../../components/candidate/product/ProductRibbon'
import ProductTabNav from '../../../components/candidate/product/ProductTabNav'
import ProductMain from '../../../components/candidate/product/ProductMain'
import { DEFAULT_PAGE_SIZE } from '../../../components/utils/constants'
import { ProductFilterDispatchContext } from '../../../components/context/candidate/ProductFilterContext'

const ProductListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  const { query: { page } } = useRouter()
  const { setPageNumber, setPageOffset } = useContext(ProductFilterDispatchContext)

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  return (
    <>
      <NextSeo
        title={format('ui.candidateProduct.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateProduct.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ProductRibbon />
          <ProductTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ProductMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ProductListPage
