import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'
import ProductRibbon from '../../../../../ui/v1/candidate/product/ProductRibbon'
import ProductTabNav from '../../../../../ui/v1/candidate/product/ProductTabNav'
import ProductMain from '../../../../../ui/v1/candidate/product/ProductMain'

const ProductListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

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
