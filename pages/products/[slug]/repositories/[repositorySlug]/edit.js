import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../components/shared/Header'
import Footer from '../../../../../components/shared/Footer'
import ProductRepositoryEdit from '../../../../../components/product/repository/ProductRepositoryEdit'

const EditProductRepositoryPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query : { slug, repositorySlug } } = useRouter()

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
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ProductRepositoryEdit productSlug={slug} repositorySlug={repositorySlug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditProductRepositoryPage
