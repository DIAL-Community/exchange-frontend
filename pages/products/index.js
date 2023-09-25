import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ProductRibbon from '../../components/product/ProductRibbon'
import ProductTabNav from '../../components/product/ProductTabNav'
import ProductMain from '../../components/product/ProductMain'
import ProductCompareBar from '../../components/product/fragments/ProductCompareBar'

const ProductListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.product.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.product.header')?.toLocaleLowerCase() }
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
          <ProductCompareBar />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ProductListPage
