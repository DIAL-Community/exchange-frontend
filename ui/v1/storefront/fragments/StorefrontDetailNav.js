import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'

const StorefrontDetailNav = ({ scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const navOptions = [{
    label: format('ui.common.detail.description'),
    value: 'ui.common.detail.description'
  }, {
    label: format('ui.specialty.header'),
    value: 'ui.specialty.header'
  }, {
    label: format('ui.resource.header'),
    value: 'ui.resource.header'
  }, {
    label: format('ui.productCertification.header'),
    value: 'ui.productCertification.header'
  }, {
    label: format('ui.buildingBlockCertification.header'),
    value: 'ui.buildingBlockCertification.header'
  }, {
    label: format('ui.office.header'),
    value: 'ui.office.header'
  }, {
    label: format('ui.contact.header'),
    value: 'ui.contact.header'
  }, {
    label: format('ui.project.header'),
    value: 'ui.project.header'
  }, {
    label: format('ui.country.header'),
    value: 'ui.country.header'
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
      <div className='font-semibold text-dial-plum'>
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

export default StorefrontDetailNav
