import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'

const ProductDetailNav = ({ scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const navOptions = [{
    label: format('ui.common.detail.description'),
    value: 'ui.common.detail.description'
  }, {
    label: format('ui.product.pricing.title'),
    value: 'ui.product.pricing.title'
  }, {
    label: format('ui.sdg.header'),
    value: 'ui.sdg.header'
  }, {
    label: format('ui.buildingBlock.header'),
    value: 'ui.buildingBlock.header'
  }, {
    label: format('ui.organization.header'),
    value: 'ui.organization.header'
  }, {
    label: format('productRepository.header'),
    value: 'productRepository.header'
  }, {
    label: format('product.source'),
    value: 'product.source'
  }, {
    label: format('product.endorsers'),
    value: 'product.endorsers'
  }, {
    label: format('product.interoperable'),
    value: 'product.interoperable'
  }, {
    label: format('product.included'),
    value: 'product.included'
  }, {
    label: format('ui.maturityScore.header'),
    value: 'ui.maturityScore.header'
  }, {
    label: format('ui.tag.header'),
    value: 'ui.tag.header'
  }]

  const onNavigationChange = (selectedNav) => {
    const { value } = selectedNav
    if (scrollRef && scrollRef.current) {
      const scrollTargetRef = scrollRef.current.find(ref => ref.value === value)
      scrollTargetRef?.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const fetchOptions = async (input) => {
    return navOptions.filter(({ label }) => label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3 text-sm py-3'>
      <div className='font-semibold text-dial-meadow'>
        {format('ui.shared.jumpTo')}
      </div>
      <Select
        async
        isBorderless
        aria-label={format('ui.ribbon.nav.ariaLabel')}
        cacheOptions
        defaultOptions={navOptions}
        loadOptions={fetchOptions}
        onChange={onNavigationChange}
        value={null}
      />
    </div>
  )
}

export default ProductDetailNav
