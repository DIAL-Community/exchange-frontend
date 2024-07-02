import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'

const ResourceDetailNav = ({ scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const navOptions = [{
    label: format('ui.common.scrollToTop'),
    value: 'ui.common.scrollToTop'
  }, {
    label: format('ui.buildingBlock.header'),
    value: 'ui.buildingBlock.header'
  }, {
    label: format('ui.product.header'),
    value: 'ui.product.header'
  }, {
    label: format('ui.useCase.header'),
    value: 'ui.useCase.header'
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
      <div className='font-semibold text-dial-stratos'>
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

export default ResourceDetailNav
