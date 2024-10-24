import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import EditButton from '../../../shared/form/EditButton'
import { HtmlViewer } from '../../../shared/form/HtmlViewer'
import { PRODUCT_REPOSITORY_DETAIL_QUERY } from '../../../shared/query/productRepository'
import { prependUrlWithProtocol } from '../../../utils/utilities'
import ProductRepositoryStats from './fragments/ProductRepositoryStats'

const ProductRepositoryRight = forwardRef(({ product, productRepository }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.top', ref: descRef }
  ]), [])

  let editingAllowed = false
  const { error } = useQuery(PRODUCT_REPOSITORY_DETAIL_QUERY, {
    variables: { productSlug: '', repositorySlug: '' },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (!error) {
    editingAllowed = true
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className="flex flex-col gap-y-3">
        {editingAllowed &&
          <div className="flex gap-x-3 ml-auto">
            <EditButton
              type="link"
              href={
                `/health/products/${product.slug}` +
                `/repositories/${productRepository.slug}/edit`
              }
            />
          </div>
        }
        <div className="text-xl text-health-blue font-semibold pb-3 pt-1">
          {productRepository.name}
        </div>
        <div className="block">
          <HtmlViewer
            initialContent={productRepository?.description}
            editorId="use-case-step-description"
          />
        </div>
        <hr className="border-b border-dial-blue-chalk my-3"/>
        <div className="text-lg font-semibold text-dial-blueberry py-3">
          {format('productRepository.absoluteUrl')}
        </div>
        <div className="flex pb-3 text-dial-stratos text-sm">
          <a
            href={prependUrlWithProtocol(productRepository.absoluteUrl)}
            target="_blank"
            rel="noreferrer"
            className="flex border-b border-dial-iris-blue ">
            <div className="line-clamp-1 break-all">
              {productRepository.absoluteUrl}
            </div>
          </a>
          &nbsp;⧉
        </div>
        <hr className="border-b border-dial-blue-chalk my-3"/>
        {productRepository.languageData.data && productRepository.statisticalData.data &&
          <ProductRepositoryStats
            languageData={productRepository.languageData}
            statisticalData={productRepository.statisticalData}
          />
        }
      </div>
    </div>
  )
})

ProductRepositoryRight.displayName = 'ProductRepositoryRight'

export default ProductRepositoryRight
