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
    label: format('ui.extraAttributes.header'),
    value: 'ui.product.extraAttributes'
  }, {
    label: format('ui.maturityScore.header'),
    value: 'ui.maturityScore.header'
  }, {
    label: format('ui.category.header'),
    value: 'ui.softwareCategories.header'
  }, {
    label: format('ui.organization.header'),
    value: 'ui.organization.header'
  }, {
    label: format('ui.country.header'),
    value: 'ui.country.header'
  }, {
    label: format('ui.project.header'),
    value: 'ui.project.header'
  }, {
    label: format('productRepository.header'),
    value: 'productRepository.header'
  }, {
    label: format('ui.tag.header'),
    value: 'ui.tag.header'
  }, {
    label: format('ui.product.pricing.title'),
    value: 'ui.product.pricing.title'
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
      <div className='font-semibold text-black'>
        {format('ui.shared.jumpToSection')}
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
