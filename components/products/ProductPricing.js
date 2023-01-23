import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import EditableSection from '../shared/EditableSection'
import { HtmlViewer } from '../shared/HtmlViewer'

const ProductPricing = ({ product, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayModeBody = (
    <div className='flex flex-wrap gap-2'>
      <div className='w-full lg:w-1/2 flex gap-2'>
        <div className='font-medium'>{format('product.pricing.hostingModel')}:</div>
        <div className='font-semibold inline'>
          {product.hostingModel || format('general.na')}
        </div>
      </div>
      <div className='flex gap-2'>
        <div className='font-medium'>{format('product.pricing.pricingModel')}:</div>
        <div className='font-semibold inline'>
          {product.pricingModel || format('general.na')}
        </div>
      </div>
      <div className={`w-full flex ${product.pricingDetails?.length > 0 && 'flex-col'} gap-2`}>
        <div className='font-medium'>{format('product.pricing.pricingDetails')}:</div>
        <div className='inline'>
          {product.pricingDetails
            ? <HtmlViewer
              className='-mb-12'
              initialContent={product?.pricingDetails}
              editorId='pricing-details'
            />
            : format('general.na')
          }
        </div>
      </div>
    </div>
  )

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('product.pricing.header')}
      onSubmit={null}
      onCancel={null}
      isDirty={false}
      isMutating={false}
      displayModeBody={displayModeBody}
      editModeBody={null}
    />
  )
}

export default ProductPricing
