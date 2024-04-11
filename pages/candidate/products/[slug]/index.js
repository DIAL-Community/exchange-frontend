import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../components/shared/Header'
import ClientOnly from '../../../../lib/ClientOnly'
import Footer from '../../../../components/shared/Footer'
import ProductDetail from '../../../../components/candidate/product/ProductDetail'

const ProductPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

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
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ProductDetail slug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ProductPage
